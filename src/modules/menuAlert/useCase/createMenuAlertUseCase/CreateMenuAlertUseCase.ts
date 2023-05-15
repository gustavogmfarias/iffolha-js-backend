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
class CreateMenuAlertUseCase {
    constructor(
        @inject("MenuAlertRepository")
        private menuAlertRepository: IMenuAlertRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        content: string,
        color: string,
        menuAlertIsActive: boolean,
        userAdminId: string
    ): Promise<IResponse> {
        let menuAlert;
        try {
            menuAlert = await this.menuAlertRepository.create(
                content,
                color,
                menuAlertIsActive
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "MENUALERT",
            description: `MenuAlert created successfully!`,
            previousContent: JSON.stringify(menuAlert),
            contentEdited: JSON.stringify(menuAlert),
            editedByUserId: userAdminId,
            modelEditedId: menuAlert.id,
        });

        return { menuAlert, log };
    }
}

export { CreateMenuAlertUseCase };
