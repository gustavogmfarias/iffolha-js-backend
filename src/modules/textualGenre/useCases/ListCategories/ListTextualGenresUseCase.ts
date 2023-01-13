/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";

import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { TextualGenre } from "@prisma/client";
import { ITextualGenreRepository } from "@modules/textualGenre/repositories/ITextualGenreRepository";

interface IResponse {
    textualGenres: TextualGenre[];
    totalCount: number;
}

@injectable()
class ListTextualGenresUseCase {
    constructor(
        @inject("TextualGenreRepository")
        private textualGenreRepository: ITextualGenreRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<IResponse> {
        const totalCount =
            await this.textualGenreRepository.totalTextualGenres();
        let textualGenres: TextualGenre[];

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
            textualGenres = await this.textualGenreRepository.listTextualGenres(
                {
                    page,
                    perPage,
                }
            );
        }

        if (page && perPage && name) {
            textualGenres = await this.textualGenreRepository.listTextualGenres(
                {
                    page,
                    perPage,
                },
                name
            );
        }

        if (!page && !perPage && name) {
            textualGenres = await this.textualGenreRepository.listTextualGenres(
                {},
                name
            );
        }

        if (!page && !perPage && !name) {
            textualGenres = await this.textualGenreRepository.listTextualGenres(
                {},
                name
            );
        }

        return { textualGenres, totalCount };
    }
}
export { ListTextualGenresUseCase };
