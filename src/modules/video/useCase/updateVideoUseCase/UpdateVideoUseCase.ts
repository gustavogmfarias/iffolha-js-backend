import { IVideoRepository } from "@modules/video/repositories/IVideoRepository";
import { Video, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    video: Video;
    log: Log;
}

@injectable()
class UpdateVideoUseCase {
    constructor(
        @inject("VideoRepository")
        private videoRepository: IVideoRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        id: string,
        description: string,
        url: string,
        userAdminId: string
    ): Promise<IResponse> {
        const videoToUpdate = await this.videoRepository.findById(id);

        if (!videoToUpdate) {
            throw new AppError("Video doesn't exist", 400);
        }

        let videoUpdated;

        try {
            videoUpdated = await this.videoRepository.update(
                id,
                description,
                url
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "VIDEO",
            description: `Video updated successfully!`,
            previousContent: JSON.stringify(videoToUpdate),
            contentEdited: JSON.stringify(videoUpdated),
            editedByUserId: userAdminId,
            modelEditedId: videoUpdated.id,
        });

        return { video: videoUpdated, log };
    }
}

export { UpdateVideoUseCase };
