import { User } from "@prisma/client";
import { AppError } from "@shared/errors/AppError";
import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({
        name,
        lastName,
        password,
        email,
        avatarUrl,
    }: ICreateUserDTO): Promise<void> {
        const userAlreadyExists = await this.usersRepository.findByEmail(email);

        if (userAlreadyExists) {
            throw new AppError("User already exists", 400);
        }

        const passwordHash = await hash(password, 12);

        await this.usersRepository.create({
            name,
            lastName,
            password: passwordHash,
            email,
            avatarUrl,
        });
    }
}

export { CreateUserUseCase };
