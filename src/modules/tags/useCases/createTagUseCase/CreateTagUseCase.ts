import { ITagsRepository } from "@modules/tags/repositories/ITagsRepository";
import { Log, Tag } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    tag: Tag;
    log: Log;
}

@injectable()
class CreateTagUseCase {
    constructor(
        @inject("TagRepository") private tagsRepository: ITagsRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(name: string, userAdminId: string): Promise<IResponse> {
        let tag = await this.tagsRepository.findTagByName(name);

        if (tag) {
            throw new AppError("Tag already exists", 400);
        }

        tag = await this.tagsRepository.createTag(name);

        const log = await this.logProvider.create({
            logRepository: "TAG",
            description: `Tag created successfully!`,
            previousContent: JSON.stringify(tag),
            contentEdited: JSON.stringify(tag),
            editedByUserId: userAdminId,
            modelEditedId: tag.id,
        });

        return { tag, log };
    }
}

export { CreateTagUseCase };
