import { IMenuAlertRepository } from "@modules/menuAlert/repositories/IMenuAlertRepository";
import { Log, MenuAlert } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    menuAlert: MenuAlert;
    log: Log;
}

@injectable()
class DeleteMenuAlertUseCase {
    constructor(
        @inject("MenuAlertRepository")
        private menuAlertRepository: IMenuAlertRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        menuAlertToDeleteId: string
    ): Promise<IResponse> {
        const menuAlert = await this.menuAlertRepository.findById(
            menuAlertToDeleteId
        );

        if (!menuAlert) {
            throw new AppError("MenuAlert doesn't exists", 404);
        }
        let menuAlertDeleted;

        try {
            menuAlertDeleted =
                this.menuAlertRepository.delete(menuAlertToDeleteId);
        } catch (err) {
            throw new AppError("MenuAlert wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "SCHOOLLEVEL",
            description: `MenuAlert successfully deleted!`,
            previousContent: JSON.stringify(menuAlert),
            contentEdited: JSON.stringify(menuAlert),
            editedByUserId: userAdminId,
            modelEditedId: menuAlert.id,
        });

        return { menuAlert, log };
    }
}

export { DeleteMenuAlertUseCase };
