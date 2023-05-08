import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";
import { SchoolLevel } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface ISchoolLevelRepository {
    create(name: string): Promise<SchoolLevel>;
    update(id: string, name: string): Promise<SchoolLevel>;
    delete(id: string): Promise<void>;

    list(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<SchoolLevel[]>;

    findByName(name: string): Promise<SchoolLevel>;
    findById(id: string): Promise<SchoolLevel>;
}
