import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateSettingUseCase } from "./UpdateSettingUseCase";

class UpdateSettingController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;
        const { id: settingId } = request.params;

        const { title, mainBarColor } = request.body;

        const updateSettingUseCase = container.resolve(UpdateSettingUseCase);

        const setting = await updateSettingUseCase.execute(
            settingId,
            title,
            mainBarColor,
            userAdminId
        );

        return response.status(201).send(setting);
    }
}

export { UpdateSettingController };
