import { Newsletter } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface INewsletterRepository {
    create(name: string, email: string): Promise<Newsletter>;

    delete(id: string): Promise<void>;

    list(
        { page, perPage }: IPaginationRequestDTO,
        email?: string
    ): Promise<Newsletter[]>;

    findById(id: string): Promise<Newsletter>;
    findByEmail(email: string): Promise<Newsletter>;
}
