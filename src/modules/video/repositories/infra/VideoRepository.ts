import { Video } from "@prisma/client";
/* eslint-disable no-restricted-syntax */
import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";

import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { IVideoRepository } from "../IVideoRepository";

export class VideoRepository implements IVideoRepository {
    async create(description: string, url: string): Promise<Video> {
        const video = await prisma.video.create({
            data: { description, url },
        });

        return video;
    }

    async delete(id: string): Promise<void> {
        await prisma.video.delete({
            where: { id },
        });
    }

    async list(
        { page, perPage }: IPaginationRequestDTO,
        description?: string
    ): Promise<Video[]> {
        let videos: Video[];

        // se não tiver os 3
        if (!page && !perPage && !description) {
            videos = await prisma.video.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else if (page && perPage && !description) {
            videos = await prisma.video.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else if (!page && !page && description) {
            videos = await prisma.video.findMany({
                where: {
                    description: {
                        contains: description,
                        mode: "insensitive",
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            videos = await prisma.video.findMany({
                where: {
                    description: {
                        contains: description,
                        mode: "insensitive",
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        return videos;
    }

    async findById(id: string): Promise<Video> {
        const video = await prisma.video.findUnique({
            where: {
                id,
            },
        });

        return video;
    }

    imageUrl(video: Video): string {
        switch (process.env.DISK) {
            case "local":
                return `${process.env.APP_API_URL}/video-image/${video.imageUrl}`;
            case "s3":
                return `${process.env.AWS_BUCKET_URL}/video-image/${video.imageUrl}`;
            default:
                return null;
        }
    }

    async update(
        id: string,
        description?: string,
        url?: string,
        imageUrl?: string
    ): Promise<Video> {
        const video = await prisma.video.update({
            where: { id },
            data: { description, url, imageUrl },
        });

        return video;
    }
}
