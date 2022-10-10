import { inject, injectable } from "tsyringe";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
    ArticleId: string;
    imageFile: string;
}

@injectable()
class AddImagesArticleUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}

    async execute({ ArticleId, imageFile }: IRequest): Promise<void> {
        const user = await this.usersRepository.findById(ArticleId);

        if (!user) {
            throw new AppError("User doesn't exist");
        }

        if (user.avatarUrl) {
            await this.storageProvider.delete(user.avatarUrl, "avatar");
        }

        await this.storageProvider.save(imageFile, "avatar");

        await this.usersRepository.update({
            ArticleId,
            imageFile,
        });
    }
}

export { AddImagesArticleUseCase };
