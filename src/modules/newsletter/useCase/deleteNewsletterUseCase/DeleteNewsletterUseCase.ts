import { INewsletterRepository } from "@modules/newsletter/repositories/INewsletterRepository";
import { Log, Newsletter } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    newsletter: Newsletter;
    log: Log;
}

@injectable()
class DeleteNewsletterUseCase {
    constructor(
        @inject("NewsletterRepository")
        private newsletterRepository: INewsletterRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        newsletterToDeleteId: string
    ): Promise<IResponse> {
        const newsletter = await this.newsletterRepository.findById(
            newsletterToDeleteId
        );

        if (!newsletter) {
            throw new AppError("Newsletter doesn't exists", 404);
        }
        let newsletterDeleted;

        try {
            newsletterDeleted =
                this.newsletterRepository.delete(newsletterToDeleteId);
        } catch (err) {
            throw new AppError("Newsletter wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "NEWSLETTER",
            description: `Newsletter successfully deleted!`,
            previousContent: JSON.stringify(newsletter),
            contentEdited: JSON.stringify(newsletter),
            editedByUserId: userAdminId,
            modelEditedId: newsletter.id,
        });

        return { newsletter, log };
    }
}

export { DeleteNewsletterUseCase };
