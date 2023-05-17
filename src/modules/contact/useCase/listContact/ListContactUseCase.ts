/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";

import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Contact } from "@prisma/client";
import { IContactRepository } from "@modules/contact/repositories/IContactRepository";

interface IResponse {
    contacts: Contact[];
    totalCount: number;
}

@injectable()
class ListContactUseCase {
    constructor(
        @inject("ContactRepository")
        private contactRepository: IContactRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        description?: string
    ): Promise<IResponse> {
        const totalCount = await this.contactRepository.list({});
        let contacts: Contact[];

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
            contacts = await this.contactRepository.list({
                page,
                perPage,
            });
        }

        if (page && perPage && description) {
            contacts = await this.contactRepository.list(
                {
                    page,
                    perPage,
                },
                description
            );
        }

        if (!page && !perPage && description) {
            contacts = await this.contactRepository.list({}, description);
        }

        if (!page && !perPage && !description) {
            contacts = await this.contactRepository.list({}, description);
        }

        return { contacts, totalCount: totalCount.length };
    }
}
export { ListContactUseCase };
