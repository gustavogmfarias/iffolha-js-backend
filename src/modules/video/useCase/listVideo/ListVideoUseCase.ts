/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";

import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Video } from "@prisma/client";
import { IVideoRepository } from "@modules/video/repositories/IVideoRepository";

interface IResponse {
    videos: Video[];
    totalCount: number;
}

@injectable()
class ListVideoUseCase {
    constructor(
        @inject("VideoRepository")
        private videoRepository: IVideoRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        description?: string
    ): Promise<IResponse> {
        const totalCount = await this.videoRepository.list({});
        let videos: Video[];

        if (description === undefined || description === "undefined") {
            description = null;
        }

        if (page === undefined) {
            page = null;
        }

        if (perPage === undefined) {
            perPage = null;
        }

        if (page && perPage) {
            videos = await this.videoRepository.list({
                page,
                perPage,
            });
        }

        if (page && perPage && description) {
            videos = await this.videoRepository.list(
                {
                    page,
                    perPage,
                },
                description
            );
        }

        if (!page && !perPage && description) {
            videos = await this.videoRepository.list({}, description);
        }

        if (!page && !perPage && !description) {
            videos = await this.videoRepository.list({}, description);
        }

        return { videos, totalCount: totalCount.length };
    }
}
export { ListVideoUseCase };
