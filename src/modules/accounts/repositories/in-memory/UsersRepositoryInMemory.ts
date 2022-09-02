import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { Log, User, UserToken } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepositoryInMemory implements IUsersRepository {
    users: User[] = [];

    userTokens: UserToken[] = [];

    logs: Log[] = [];

    async create({
        name,
        lastName,
        password,
        email,
        role,
    }: ICreateUserDTO): Promise<User> {
        const user: User = new User();

        Object.assign(user, {
            id: uuidv4(),
            name,
            lastName,
            password,
            email,
            role,
            createdAt: new Date(),
            avatarUrl: String(),
            userToken: this.userTokens,
            log: this.logs,
        });

        this.users.push(user);

        return user;
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    listUsers(data: IPaginationRequestDTO): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

    findByEmail(email: string): Promise<User> {
        const userFound = this.users.find((user) => user.email === email);

        return user; ///ver no youtube
    }

    findById(id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    findByName(name: string, data: IPaginationRequestDTO): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

    update(data: IUpdateUserDTO): Promise<User> {
        throw new Error("Method not implemented.");
    }

    avatarUrl(user: User): Promise<string> {
        throw new Error("Method not implemented.");
    }

    changeOwnPassword(data: IUpdateUserDTO): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
