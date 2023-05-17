import { IVideoRepository } from "@modules/video/repositories/IVideoRepository";
import { Log, Video } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    video: Video;
    log: Log;
}

@injectable()
class DeleteVideoUseCase {
    constructor(
        @inject("VideoRepository")
        private videoRepository: IVideoRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        videoToDeleteId: string
    ): Promise<IResponse> {
        const video = await this.videoRepository.findById(videoToDeleteId);

        if (!video) {
            throw new AppError("Video doesn't exists", 404);
        }
        let videoDeleted;

        try {
            videoDeleted = this.videoRepository.delete(videoToDeleteId);
        } catch (err) {
            throw new AppError("Video wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "VIDEO",
            description: `Video successfully deleted!`,
            previousContent: JSON.stringify(video),
            contentEdited: JSON.stringify(video),
            editedByUserId: userAdminId,
            modelEditedId: video.id,
        });

        return { video, log };
    }
}

export { DeleteVideoUseCase };
