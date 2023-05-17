import { IContactRepository } from "@modules/contact/repositories/IContactRepository";
import { Contact, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    contact: Contact;
    log: Log;
}

@injectable()
class CreateContactUseCase {
    constructor(
        @inject("ContactRepository")
        private contactRepository: IContactRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        name: string,
        email: string,
        description: string,
        content: string,
        userAdminId: string
    ): Promise<IResponse> {
        let contact;

        try {
            contact = await this.contactRepository.create(
                name,
                email,
                description,
                content
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "CONTACT",
            description: `Contact created successfully!`,
            previousContent: JSON.stringify(contact),
            contentEdited: JSON.stringify(contact),
            editedByUserId: userAdminId,
            modelEditedId: contact.id,
        });

        return { contact, log };
    }
}

export { CreateContactUseCase };
