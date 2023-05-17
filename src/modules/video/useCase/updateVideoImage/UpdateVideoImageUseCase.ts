import { inject, injectable } from "tsyringe";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { IVideoRepository } from "@modules/video/repositories/IVideoRepository";

interface IRequest {
    videoToEditId: string;
    imageFile: string;
}

@injectable()
class UpdateVideoImageUseCase {
    constructor(
        @inject("VideosRepository")
        private videoRepository: IVideoRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}

    async execute({ videoToEditId, imageFile }: IRequest): Promise<void> {
        const video = await this.videoRepository.findById(videoToEditId);

        if (!video) {
            throw new AppError("Video doesn't exist");
        }

        if (video.imageUrl) {
            await this.storageProvider.delete(video.imageUrl, "video-images");
        }

        await this.storageProvider.save(imageFile, "video-images");

        await this.videoRepository.update(videoToEditId, imageFile);
    }
}

export { UpdateVideoImageUseCase };
