/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";
import { ITagsRepository } from "@modules/tags/repositories/ITagsRepository";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Tag } from "@prisma/client";

interface IResponse {
    tags: Tag[];
    totalCount: number;
}

@injectable()
class ListTagsUseCase {
    constructor(
        @inject("TagsRepository")
        private tagsRepository: ITagsRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<IResponse> {
        const totalCount = await this.tagsRepository.totalTags();
        let tags: Tag[];

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
            tags = await this.tagsRepository.listTags({
                page,
                perPage,
            });
        }

        if (page && perPage && name) {
            tags = await this.tagsRepository.listTags(
                {
                    page,
                    perPage,
                },
                name
            );
        }

        if (!page && !perPage && name) {
            tags = await this.tagsRepository.listTags({}, name);
        }

        if (!page && !perPage && !name) {
            tags = await this.tagsRepository.listTags({}, name);
        }

        return { tags, totalCount };
    }
}
export { ListTagsUseCase };
