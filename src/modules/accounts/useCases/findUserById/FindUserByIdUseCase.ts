import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class FindUserByIdUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository
    ) {}

    async execute({ id }): Promise<IUserResponseDTO | null> {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new AppError("User doesn't exist", 404);
        }
        const userDTO = this.usersRepository.convertDTO(user);
        return userDTO;
    }
}
export { FindUserByIdUseCase };
