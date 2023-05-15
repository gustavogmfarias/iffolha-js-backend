import { Setting } from "@prisma/client";
/* eslint-disable no-restricted-syntax */

import { prisma } from "@shared/database/prismaClient";
import { ISettingRepository } from "../ISettingRepository";

export class SettingRepository implements ISettingRepository {
    async update(
        id: string,
        title: string,
        mainBarColor: string
    ): Promise<Setting> {
        const setting = await prisma.setting.update({
            where: { id },
            data: { title, mainBarColor },
        });

        return setting;
    }
}
