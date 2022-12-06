import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ITagsRepository } from "@modules/tags/repositories/ITagsRepository";
import { Log, Tag, User } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    tag: Tag;
    log: Log;
}

@injectable()
class DeleteTagUseCase {
    constructor(
        @inject("TagsRepository") private tagsRepository: ITagsRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        tagToDeleteName: string
    ): Promise<IResponse> {
        const tag = await this.tagsRepository.findTagByName(tagToDeleteName);

        if (!tag) {
            throw new AppError("Tag doesn't exists", 404);
        }
        let tagDeleted;

        try {
            tagDeleted = this.tagsRepository.deleteTag(tagToDeleteName);
        } catch (err) {
            throw new AppError("Tag wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "TAG",
            description: `Tag successfully deleted!`,
            previousContent: JSON.stringify(tag),
            contentEdited: JSON.stringify(tag),
            editedByUserId: userAdminId,
            modelEditedId: tag.id,
        });

        return { tag, log };
    }
}

export { DeleteTagUseCase };
