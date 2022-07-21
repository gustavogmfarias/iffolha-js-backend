import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserToken } from "@prisma/client";

interface IUsersTokensRepository {
    create({
        expiresDate,
        userId,
        refreshToken,
    }: ICreateUserTokenDTO): Promise<UserToken>;

    findByUserIdAndRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<UserToken>;

    deleteById(id: string): Promise<void>;

    findByRefreshToken(refreshToken: string): Promise<UserToken>;
}

export { IUsersTokensRepository };
