import { SocialMedia } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface ISocialMediaRepository {
    create(name: string, url: string): Promise<SocialMedia>;
    update(id: string, name: string, url: string): Promise<SocialMedia>;
    delete(id: string): Promise<void>;

    list(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<SocialMedia[]>;

    findByName(name: string): Promise<SocialMedia>;
    findById(id: string): Promise<SocialMedia>;
}
