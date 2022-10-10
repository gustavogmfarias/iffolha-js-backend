import { IReportImagesRepository } from "../IReportImagesRepository";

export class ReportImagesRepository implements IReportImagesRepository {
    create(reportId: string, isMain: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
