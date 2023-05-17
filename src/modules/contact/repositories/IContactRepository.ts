import { Contact } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface IContactRepository {
    create(
        name: string,
        email: string,
        description: string,
        content: string
    ): Promise<Contact>;
    update(
        id: string,
        isAnswered: boolean,
        answeredBy: string
    ): Promise<Contact>;
    delete(id: string): Promise<void>;

    list(
        { page, perPage }: IPaginationRequestDTO,
        description?: string
    ): Promise<Contact[]>;

    findById(id: string): Promise<Contact>;
}
