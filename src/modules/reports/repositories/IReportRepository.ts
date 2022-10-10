import { Report } from "@prisma/client";
import { ICreateReportDTO } from "../dtos/ICreateReportDTO";

export interface IReportRepository {
    create(data: ICreateReportDTO): Promise<Report>;
}
