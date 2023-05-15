/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";

import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { SocialMedia } from "@prisma/client";
import { ISocialMediaRepository } from "@modules/socialMedia/repositories/ISocialMediaRepository";

interface IResponse {
    socialMedias: SocialMedia[];
    totalCount: number;
}

@injectable()
class ListSocialMediaUseCase {
    constructor(
        @inject("SocialMediaRepository")
        private socialMediaRepository: ISocialMediaRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<IResponse> {
        const totalCount = await this.socialMediaRepository.list({});
        let socialMedias: SocialMedia[];

        if (name === undefined || name === "undefined") {
            name = null;
        }

        if (page === undefined) {
            page = null;
        }

        if (perPage === undefined) {
            perPage = null;
        }

        if (page && perPage) {
            socialMedias = await this.socialMediaRepository.list({
                page,
                perPage,
            });
        }

        if (page && perPage && name) {
            socialMedias = await this.socialMediaRepository.list(
                {
                    page,
                    perPage,
                },
                name
            );
        }

        if (!page && !perPage && name) {
            socialMedias = await this.socialMediaRepository.list({}, name);
        }

        if (!page && !perPage && !name) {
            socialMedias = await this.socialMediaRepository.list({}, name);
        }

        return { socialMedias, totalCount: totalCount.length };
    }
}
export { ListSocialMediaUseCase };
