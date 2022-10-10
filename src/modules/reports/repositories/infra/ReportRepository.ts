import { ICreateReportDTO } from "@modules/reports/dtos/ICreateReportDTO";
import { Report } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { IReportRepository } from "../IReportRepository";

export class ReportRepository implements IReportRepository {
    async create({
        title,
        subTitle,
        content,
        mainImage,
        publishedByUserId,
        editedByUserId,
        publishedDate,
        updatedDate,
        isHighlight,
        url,
        AuthorsOnReports,
    }: ICreateReportDTO): Promise<Report> {
        const report = await prisma.report.create({
            data: {
                title,
                subTitle,
                content,
                mainImage,
                publishedByUserId,
                editedByUserId,
                publishedDate,
                updatedDate,
                isHighlight,
                url,
                AuthorsOnReports,
            },
        });

        return report;
    }
}
