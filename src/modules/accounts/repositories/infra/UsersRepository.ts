/* eslint-disable no-await-in-loop */
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";

import { User } from "@prisma/client";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

import { prisma } from "@shared/database/prismaClient";
import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";

export class UsersRepository implements IUsersRepository {
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
        last_name,
        password,
        email,
        role,
    }: ICreateUserDTO): Promise<void> {
        await prisma.user.create({
            data: {
                name,
                last_name,
                password,
                email,
                role,
            },
        });
    }

    async update({
        name,
        last_name,
        password,
        email,
        id,
        role,
    }: IUpdateUserDTO): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: {
                name,
                last_name,
                password,
                email,
                role,
            },
        });
    }

    async changeOwnPassword({ password, id }: IUpdateUserDTO): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: {
                password,
            },
        });
    }

    async avatarUrl(user: User): Promise<string> {
        switch (process.env.DISK) {
            case "local":
                return `${process.env.APP_API_URL}/avatar/${user.avatar_url}`;
            case "s3":
                return `${process.env.AWS_BUCKET_URL}/avatar/${user.avatar_url}`;
            default:
                return null;
        }
    }

    async listUsers({ page, per_page }): Promise<User[]> {
        let users: User[];

        if (!page || !per_page) {
            users = await prisma.user.findMany({
                orderBy: {
                    id: "desc",
                },
            });
        } else {
            users = await prisma.user.findMany({
                take: Number(per_page),
                skip: (Number(page) - 1) * Number(per_page),
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
}
