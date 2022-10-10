import { inject, injectable } from "tsyringe";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
    reportId: string;
    imageFile: string;
}

@injectable()
class AddImagesReportUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}

    async execute({ reportId, imageFile }: IRequest): Promise<void> {
        const user = await this.usersRepository.findById(reportId);

        if (!user) {
            throw new AppError("User doesn't exist");
        }

        if (user.avatarUrl) {
            await this.storageProvider.delete(user.avatarUrl, "avatar");
        }

        await this.storageProvider.save(imageFile, "avatar");

        await this.usersRepository.update({
            reportId,
            imageFile,
        });
    }
}

export { AddImagesReportUseCase };
