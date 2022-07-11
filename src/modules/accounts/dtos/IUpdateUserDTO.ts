import { Role } from "@prisma/client";

export interface IUpdateUserDTO {
    id: string;
    name?: string;
    last_name?: string;
    email?: string;
    role?: Role;
    old_password?: string;
    password?: string;
    confirm_password?: string;
    avatar_url?: string;
}
