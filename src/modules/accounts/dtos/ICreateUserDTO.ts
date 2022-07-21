import { Role } from "@prisma/client";

export interface ICreateUserDTO {
    name: string;
    lastName: string;
    password: string;
    email: string;
    avatarUrl?: string;
    role?: Role;
}
