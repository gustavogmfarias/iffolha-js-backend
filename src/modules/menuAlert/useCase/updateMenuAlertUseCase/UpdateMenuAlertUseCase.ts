import { IMenuAlertRepository } from "@modules/menuAlert/repositories/IMenuAlertRepository";
import { MenuAlert, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    menuAlert: MenuAlert;
    log: Log;
}

@injectable()
class UpdateMenuAlertUseCase {
    constructor(
        @inject("MenuAlertRepository")
        private menuAlertRepository: IMenuAlertRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        id: string,
        content: string,
        color: string,
        menuAlertIsActive: boolean,
        userAdminId: string
    ): Promise<IResponse> {
        const menuAlertToUpdate = await this.menuAlertRepository.findById(id);

        if (!menuAlertToUpdate) {
            throw new AppError("MenuAlert doesn't exist", 400);
        }

        let menuAlertUpdated;

        try {
            menuAlertUpdated = await this.menuAlertRepository.update(
                id,
                content,
                color,
                menuAlertIsActive
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "MENUALERT",
            description: `MenuAlert updated successfully!`,
            previousContent: JSON.stringify(menuAlertToUpdate),
            contentEdited: JSON.stringify(menuAlertUpdated),
            editedByUserId: userAdminId,
            modelEditedId: menuAlertUpdated.id,
        });

        return { menuAlert: menuAlertUpdated, log };
    }
}

export { UpdateMenuAlertUseCase };
