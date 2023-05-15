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
class UpdateSocialMediaUseCase {
    constructor(
        @inject("SocialMediaRepository")
        private socialMediaRepository: ISocialMediaRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        id: string,
        name: string,
        userAdminId: string
    ): Promise<IResponse> {
        const socialMedia = await this.socialMediaRepository.findByName(name);
        const socialMediaToUpdate = await this.socialMediaRepository.findById(
            id
        );

        if (socialMedia) {
            throw new AppError("SocialMedia already exists", 400);
        }

        if (!socialMediaToUpdate) {
            throw new AppError("SocialMedia doesn't exist", 400);
        }

        let schoolLeveUpdated;

        try {
            schoolLeveUpdated = await this.socialMediaRepository.update(
                id,
                name
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "SCHOOLLEVEL",
            description: `SocialMedia updated successfully!`,
            previousContent: JSON.stringify(socialMediaToUpdate),
            contentEdited: JSON.stringify(schoolLeveUpdated),
            editedByUserId: userAdminId,
            modelEditedId: schoolLeveUpdated.id,
        });

        return { socialMedia: schoolLeveUpdated, log };
    }
}

export { UpdateSocialMediaUseCase };
