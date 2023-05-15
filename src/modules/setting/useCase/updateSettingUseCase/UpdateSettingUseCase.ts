import { ISettingRepository } from "@modules/setting/repositories/ISettingRepository";
import { Setting, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    setting: Setting;
    log: Log;
}

@injectable()
class UpdateSettingUseCase {
    constructor(
        @inject("SettingRepository")
        private settingRepository: ISettingRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        id: string,
        title: string,
        mainBarColor: string,
        userAdminId: string
    ): Promise<IResponse> {
        let settingUpdated;

        try {
            settingUpdated = await this.settingRepository.update(
                id,
                title,
                mainBarColor
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "SETTING",
            description: `Setting updated successfully!`,
            previousContent: JSON.stringify(settingUpdated),
            contentEdited: JSON.stringify(settingUpdated),
            editedByUserId: userAdminId,
            modelEditedId: settingUpdated.id,
        });

        return { setting: settingUpdated, log };
    }
}

export { UpdateSettingUseCase };
