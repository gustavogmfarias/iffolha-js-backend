import { IContactRepository } from "@modules/contact/repositories/IContactRepository";
import { Log, Contact } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    contact: Contact;
    log: Log;
}

@injectable()
class DeleteContactUseCase {
    constructor(
        @inject("ContactRepository")
        private contactRepository: IContactRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        contactToDeleteId: string
    ): Promise<IResponse> {
        const contact = await this.contactRepository.findById(
            contactToDeleteId
        );

        if (!contact) {
            throw new AppError("Contact doesn't exists", 404);
        }
        let contactDeleted;

        try {
            contactDeleted = this.contactRepository.delete(contactToDeleteId);
        } catch (err) {
            throw new AppError("Contact wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "CONTACT",
            description: `Contact successfully deleted!`,
            previousContent: JSON.stringify(contact),
            contentEdited: JSON.stringify(contact),
            editedByUserId: userAdminId,
            modelEditedId: contact.id,
        });

        return { contact, log };
    }
}

export { DeleteContactUseCase };
