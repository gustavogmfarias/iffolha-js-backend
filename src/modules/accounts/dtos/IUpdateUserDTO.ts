import { Role } from "@prisma/client";

export interface IUpdateUserDTO {
    id: string;
    name?: string;
    lastName?: string;
    email?: string;
    role?: Role;
    previousPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    avatarUrl?: string;
}
