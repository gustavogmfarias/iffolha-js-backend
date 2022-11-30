import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";

interface IResponse {
    usersDTO: IUserResponseDTO[];
    totalCount: number;
}
@injectable()
class ListUsersUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute(
        name: string,
        { page, perPage }: IPaginationRequestDTO
    ): Promise<IResponse> {
        const totalCount = await this.usersRepository.totalUsers();
        const users = await this.usersRepository.listUsers(
            {
                page,
                perPage,
            },
            name
        );

        const usersDTO: IUserResponseDTO[] = [];
        users.map((user) => {
            return usersDTO.push(this.usersRepository.convertDTO(user));
        });

        return { usersDTO, totalCount };
    }
}
export { ListUsersUseCase };
