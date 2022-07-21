import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { injectable, inject } from "tsyringe";

@injectable()
class UpdateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute({
        id,
        name,
        last_name,
        email,
        role,
        password,
        old_password,
        confirm_password,
    }: IUpdateUserDTO): Promise<User> {
        const user = await this.usersRepository.findById(id);

        let passwordHash;

        if (old_password) {
            const passwordMatch = await compare(old_password, user.password);

            if (!passwordMatch) {
                throw new AppError("Last Password doesn't match", 401);
            }
        }
        if (password && confirm_password) {
            if (password === confirm_password) {
                passwordHash = await hash(password, 12);
            } else {
                throw new AppError("Passwords don't match", 401);
            }
        }

        const userEdited = await this.usersRepository.update({
            id,
            name,
            last_name,
            password: passwordHash,
            email,
            role,
        });

        const log = await this.logProvider.create({
            logRepository: "USERSREPOSITORY",
            descricao: `Updated the user ${user.id}`,
            conteudoAnterior: JSON.stringify(user),
            conteudoNovo: JSON.stringify(userEdited),
            editedById: user.id,
            modelEditedId: user.id,
        });

        return user;
    }
}

export { UpdateUserUseCase };
