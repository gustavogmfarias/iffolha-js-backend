import { inject, injectable } from "tsyringe";
import "reflect-metadata";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppError } from "@shared/errors/AppError";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: { name: string; email: string; role: string; id: string };
    token: string;
    refreshToken: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        // verificar se o usuario existe
        const user = await this.usersRepository.findByEmail(email);
        const {
            expiresInToken,
            secretRefreshToken,
            secretToken,
            expiresInRefreshToken,
            expiresInRefreshDays,
        } = auth;

        if (!user) {
            throw new AppError("Incorrect email or password!", 401);
        }

        // senha está correta?
        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError("Incorrect email or password!", 401);
        }

        // gerar jswonwebtoken
        const token = sign({ email, role: user.role }, secretToken, {
            subject: user.id,
            expiresIn: expiresInToken,
        });

        const refreshToken = sign(
            { email, role: user.role },
            secretRefreshToken,
            {
                subject: user.id,
                expiresIn: expiresInRefreshToken,
            }
        );

        const refreshToken_expiresDate =
            this.dateProvider.addDays(expiresInRefreshDays);

        this.usersTokensRepository.create({
            expiresDate: refreshToken_expiresDate,
            refreshToken,
            userId: user.id,
            token,
        });

        const tokenReturn: IResponse = {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            refreshToken,
        };

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase };
