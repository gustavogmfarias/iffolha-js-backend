import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "@prisma/client";
import { inject, injectable } from "tsyringe";

@injectable()
class FindByNameUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository
    ) {}

    async execute(
        name: string,
        { page, per_page }: IPaginationRequestDTO
    ): Promise<IUserResponseDTO[] | null> {
        const users = await this.usersRepository.findByName(name, {
            page,
            per_page,
        });

        const usersDTO = users.map((user) => {
            return UserMap.toDTO(user);
        });

        return usersDTO;
    }
}
export { FindByNameUseCase };
