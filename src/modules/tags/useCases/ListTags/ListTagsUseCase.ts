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
        const tags = await this.tagsRepository.listTags(
            {
                page,
                perPage,
            },
            name
        );

        return { tags, totalCount };
    }
}
export { ListTagsUseCase };
