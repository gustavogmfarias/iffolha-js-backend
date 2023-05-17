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
class UpdateContactUseCase {
    constructor(
        @inject("ContactRepository")
        private contactRepository: IContactRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        id: string,
        isAnswered: boolean,
        userAdminId: string
    ): Promise<IResponse> {
        const contactToUpdate = await this.contactRepository.findById(id);

        if (!contactToUpdate) {
            throw new AppError("Contact doesn't exist", 400);
        }

        let contactUpdated;

        try {
            contactUpdated = await this.contactRepository.update(
                id,
                isAnswered,
                userAdminId
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "CONTACT",
            description: `Contact updated successfully!`,
            previousContent: JSON.stringify(contactToUpdate),
            contentEdited: JSON.stringify(contactUpdated),
            editedByUserId: userAdminId,
            modelEditedId: contactUpdated.id,
        });

        return { contact: contactUpdated, log };
    }
}

export { UpdateContactUseCase };
