/* eslint-disable no-await-in-loop */
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";

import { Role, User } from "@prisma/client";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

import { prisma } from "@shared/database/prismaClient";
import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";

export class UsersRepository implements IUsersRepository {
    async findByName(
        name: string,
        { page, perPage }: IPaginationRequestDTO
    ): Promise<User[] | null> {
        let users: User[];

        if (!page || !perPage) {
            users = await prisma.user.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                },
                orderBy: { name: "desc" },
            });
        } else {
            users = await prisma.user.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                },
                orderBy: { name: "desc" },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
            });
        }

        return users;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        return user;
    }

    async create({
        name,
        lastName,
        password,
        email,
        role,
    }: ICreateUserDTO): Promise<User> {
        const user = await prisma.user.create({
            data: {
                name,
                lastName,
                password,
                email,
                role,
            },
        });

        return user;
    }

    async update({
        name,
        lastName,
        newPassword,
        email,
        userToEditId,
        role,
        avatarUrl,
    }: IUpdateUserDTO): Promise<User> {
        const user = await prisma.user.update({
            where: { id: userToEditId },
            data: {
                name,
                lastName,
                password: newPassword,
                email,
                role,
                avatarUrl,
            },
        });

        return user;
    }

    async changeOwnPassword({
        newPassword,
        userToEditId,
    }: IUpdateUserDTO): Promise<void> {
        await prisma.user.update({
            where: { id: userToEditId },
            data: {
                password: newPassword,
            },
        });
    }

    async avatarUrl(user: User): Promise<string> {
        switch (process.env.DISK) {
            case "local":
                return `${process.env.APP_API_URL}/avatar/${user.avatarUrl}`;
            case "s3":
                return `${process.env.AWS_BUCKET_URL}/avatar/${user.avatarUrl}`;
            default:
                return null;
        }
    }

    async listUsers({ page, perPage }): Promise<User[]> {
        let users: User[];

        if (!page || !perPage) {
            users = await prisma.user.findMany({
                orderBy: {
                    id: "desc",
                },
            });
        } else {
            users = await prisma.user.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    id: "desc",
                },
            });
        }

        return users;
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }

    async findRoleByName(name: string): Promise<boolean> {
        const roles = ["USER", "ADMIN", "EDITOR", "AUTHOR"];

        const role = roles.find((roleSought) => roleSought === name);

        if (role) {
            return true;
        }
        return false;
    }
}
