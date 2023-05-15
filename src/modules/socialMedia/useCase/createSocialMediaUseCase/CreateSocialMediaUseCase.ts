import { ISocialMediaRepository } from "@modules/socialMedia/repositories/ISocialMediaRepository";
import { SocialMedia, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    socialMedia: SocialMedia;
    log: Log;
}

@injectable()
class CreateSocialMediaUseCase {
    constructor(
        @inject("SocialMediaRepository")
        private socialMediaRepository: ISocialMediaRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        name: string,
        url: string,
        userAdminId: string
    ): Promise<IResponse> {
        let socialMedia = await this.socialMediaRepository.findByName(name);

        if (socialMedia) {
            throw new AppError("SocialMedia already exists", 400);
        }

        try {
            socialMedia = await this.socialMediaRepository.create(name, url);
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "SOCIALMEDIA",
            description: `SocialMedia created successfully!`,
            previousContent: JSON.stringify(socialMedia),
            contentEdited: JSON.stringify(socialMedia),
            editedByUserId: userAdminId,
            modelEditedId: socialMedia.id,
        });

        return { socialMedia, log };
    }
}

export { CreateSocialMediaUseCase };
