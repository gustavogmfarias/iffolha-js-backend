export interface IReportImagesRepository {
    create(reportId: string, isMain: boolean): Promise<void>;
}
