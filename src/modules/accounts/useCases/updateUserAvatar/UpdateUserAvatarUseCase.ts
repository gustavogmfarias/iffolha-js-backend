import { inject, injectable } from "tsyringe";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
    userToEditId: string;
    avatarFile: string;
}

@injectable()
class UpdateUserAvatarUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}

    async execute({ userToEditId, avatarFile }: IRequest): Promise<void> {
        const user = await this.usersRepository.findById(userToEditId);

        if (!user) {
            throw new AppError("User doesn't exist");
        }

        if (user.avatarUrl) {
            await this.storageProvider.delete(user.avatarUrl, "avatar");
        }

        await this.storageProvider.save(avatarFile, "avatar");

        await this.usersRepository.update({
            userToEditId,
            avatarUrl: avatarFile,
        });
    }
}

export { UpdateUserAvatarUseCase };
