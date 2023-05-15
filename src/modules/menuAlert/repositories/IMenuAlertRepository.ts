import { MenuAlert } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface IMenuAlertRepository {
    create(
        content: string,
        color: string,
        menuAlertIsActive: boolean
    ): Promise<MenuAlert>;
    update(
        id: string,
        content: string,
        color: string,
        menuAlertIsActive: boolean
    ): Promise<MenuAlert>;
    delete(id: string): Promise<void>;

    list(
        { page, perPage }: IPaginationRequestDTO,
        content?: string
    ): Promise<MenuAlert[]>;

    findById(id: string): Promise<MenuAlert>;
}
