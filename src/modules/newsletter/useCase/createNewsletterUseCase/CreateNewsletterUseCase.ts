import { INewsletterRepository } from "@modules/newsletter/repositories/INewsletterRepository";
import { Newsletter, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    newsletter: Newsletter;
    log: Log;
}

@injectable()
class CreateNewsletterUseCase {
    constructor(
        @inject("NewsletterRepository")
        private newsletterRepository: INewsletterRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        name: string,
        email: string,
        userAdminId: string
    ): Promise<IResponse> {
        let newsletter = await this.newsletterRepository.findByEmail(email);

        if (newsletter) {
            throw new AppError("E-mail already exists", 400);
        }

        try {
            newsletter = await this.newsletterRepository.create(name, email);
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "NEWSLETTER",
            description: `Newsletter created successfully!`,
            previousContent: JSON.stringify(newsletter),
            contentEdited: JSON.stringify(newsletter),
            editedByUserId: userAdminId,
            modelEditedId: newsletter.id,
        });

        return { newsletter, log };
    }
}

export { CreateNewsletterUseCase };
