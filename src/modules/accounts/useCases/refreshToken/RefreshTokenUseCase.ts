import { inject, injectable } from "tsyringe";

import { verify, sign } from "jsonwebtoken";

import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import auth from "@config/auth";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IPayload {
    sub: string;
    email: string;
    role: string;
}

interface ITokenResponse {
    token: string;
    refreshToken: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute(token: string): Promise<ITokenResponse> {
        const { email, sub, role } = verify(
            token,
            auth.secretRefreshToken
        ) as IPayload;
        const userId = sub;

        const userToken =
            await this.usersTokensRepository.findByUserIdAndRefreshToken(
                userId,
                token
            );

        if (!userToken) {
            throw new AppError("Refresh Token doesn't Exists", 401);
        }

        await this.usersTokensRepository.deleteById(userToken.id);

        const expiresDate = this.dateProvider.addDays(
            auth.expiresInRefreshDays
        );

        const refreshToken = sign({ email, role }, auth.secretRefreshToken, {
            subject: sub,
            expiresIn: auth.expiresInRefreshToken,
        });

        await this.usersTokensRepository.create({
            expiresDate,
            refreshToken,
            userId,
            token,
        });

        const newToken = sign({ email, role }, auth.secretToken, {
            subject: userId,
            expiresIn: auth.expiresInToken,
        });

        return { refreshToken, token: newToken };
    }
}

export { RefreshTokenUseCase };
