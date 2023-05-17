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
class CreateVideoUseCase {
    constructor(
        @inject("VideoRepository")
        private videoRepository: IVideoRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        description: string,
        url: string,
        userAdminId: string
    ): Promise<IResponse> {
        let video;

        try {
            video = await this.videoRepository.create(description, url);
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "VIDEO",
            description: `Video created successfully!`,
            previousContent: JSON.stringify(video),
            contentEdited: JSON.stringify(video),
            editedByUserId: userAdminId,
            modelEditedId: video.id,
        });

        return { video, log };
    }
}

export { CreateVideoUseCase };
