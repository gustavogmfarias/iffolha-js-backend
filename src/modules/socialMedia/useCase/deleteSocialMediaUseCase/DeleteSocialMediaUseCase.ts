import { ISocialMediaRepository } from "@modules/socialMedia/repositories/ISocialMediaRepository";
import { Log, SocialMedia } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    socialMedia: SocialMedia;
    log: Log;
}

@injectable()
class DeleteSocialMediaUseCase {
    constructor(
        @inject("SocialMediaRepository")
        private socialMediaRepository: ISocialMediaRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        socialMediaToDeleteId: string
    ): Promise<IResponse> {
        const socialMedia = await this.socialMediaRepository.findById(
            socialMediaToDeleteId
        );

        if (!socialMedia) {
            throw new AppError("SocialMedia doesn't exists", 404);
        }
        let socialMediaDeleted;

        try {
            socialMediaDeleted = this.socialMediaRepository.delete(
                socialMediaToDeleteId
            );
        } catch (err) {
            throw new AppError("SocialMedia wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "SCHOOLLEVEL",
            description: `SocialMedia successfully deleted!`,
            previousContent: JSON.stringify(socialMedia),
            contentEdited: JSON.stringify(socialMedia),
            editedByUserId: userAdminId,
            modelEditedId: socialMedia.id,
        });

        return { socialMedia, log };
    }
}

export { DeleteSocialMediaUseCase };
