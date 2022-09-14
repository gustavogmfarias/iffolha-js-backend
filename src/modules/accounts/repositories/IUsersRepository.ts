import { Role, User } from "@prisma/client";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "../dtos/IUpdateUserDTO";
import { IPaginationRequestDTO } from "../dtos/IPaginationRequestDTO";

export interface IUsersRepository {
    create(data: ICreateUserDTO): Promise<User>;
    delete(id: string): Promise<void>;
    listUsers(data: IPaginationRequestDTO): Promise<User[] | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByName(
        name: string,
        data: IPaginationRequestDTO
    ): Promise<User[] | null>;
    update(data: IUpdateUserDTO): Promise<User>;
    avatarUrl(user: User): Promise<string>;
    changeOwnPassword(data: IUpdateUserDTO): Promise<void>;
    findRoleByName(name: string): Promise<boolean>;
}
