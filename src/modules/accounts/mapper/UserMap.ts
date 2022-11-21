import { User } from "@prisma/client";
import { instanceToInstance } from "class-transformer";
import { IUserResponseDTO } from "../dtos/IUserResponseDTO";

class UserMap {
    static toDTO({
        email,
        name,
        lastName,
        id,
        avatarUrl,
        role,
        createdAt,
    }: User): IUserResponseDTO {
        const user = instanceToInstance({
            email,
            name,
            lastName,
            id,
            avatarUrl,
            role,
            createdAt,
        });
        return user;
    }
}

export { UserMap };
