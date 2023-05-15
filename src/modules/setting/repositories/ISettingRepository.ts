import { Setting } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface ISettingRepository {
    update(id: string, title: string, mainBarColor: string): Promise<Setting>;
}
