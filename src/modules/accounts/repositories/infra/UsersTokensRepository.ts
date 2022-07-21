import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { UserToken } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";

class UsersTokensRepository implements IUsersTokensRepository {
    async create({
        expiresDate,
        userId,
        refreshToken,
        token,
    }: ICreateUserTokenDTO): Promise<UserToken> {
        const userToken = await prisma.userToken.create({
            data: { expiresDate, userId, refreshToken, token },
        });

        return userToken;
    }

    async findByUserIdAndRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<UserToken> {
        const userTokens = await prisma.userToken.findFirst({
            where: { userId, refreshToken },
        });

        return userTokens;
    }

    async deleteById(id: string): Promise<void> {
        await prisma.userToken.delete({ where: { id } });
    }

    async findByRefreshToken(refreshToken: string): Promise<UserToken> {
        const userToken = await prisma.userToken.findFirst({
            where: { refreshToken },
        });
        return userToken;
    }
}

export { UsersTokensRepository };
