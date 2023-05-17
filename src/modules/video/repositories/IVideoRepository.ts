import { Video } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface IVideoRepository {
    create(description: string, url: string): Promise<Video>;
    delete(id: string): Promise<void>;

    list(
        { page, perPage }: IPaginationRequestDTO,
        description?: string
    ): Promise<Video[]>;

    findById(id: string): Promise<Video>;

    imageUrl(video: Video): string;

    update(
        id: string,
        description?: string,
        url?: string,
        imageUrl?: string
    ): Promise<Video>;
}
