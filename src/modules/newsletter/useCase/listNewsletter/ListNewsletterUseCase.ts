/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";

import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Newsletter } from "@prisma/client";
import { INewsletterRepository } from "@modules/newsletter/repositories/INewsletterRepository";

interface IResponse {
    newsletters: Newsletter[];
    totalCount: number;
}

@injectable()
class ListNewsletterUseCase {
    constructor(
        @inject("NewsletterRepository")
        private newsletterRepository: INewsletterRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        email?: string
    ): Promise<IResponse> {
        const totalCount = await this.newsletterRepository.list({});
        let newsletters: Newsletter[];

        if (email === undefined || email === "undefined") {
            email = null;
        }

        if (page === undefined) {
            page = null;
        }

        if (perPage === undefined) {
            perPage = null;
        }

        if (page && perPage) {
            newsletters = await this.newsletterRepository.list({
                page,
                perPage,
            });
        }

        if (page && perPage && email) {
            newsletters = await this.newsletterRepository.list(
                {
                    page,
                    perPage,
                },
                email
            );
        }

        if (!page && !perPage && email) {
            newsletters = await this.newsletterRepository.list({}, email);
        }

        if (!page && !perPage && !email) {
            newsletters = await this.newsletterRepository.list({}, email);
        }

        return { newsletters, totalCount: totalCount.length };
    }
}
export { ListNewsletterUseCase };
