import { AuthorsOnReports } from "@prisma/client";

export interface ICreateReportDTO {
    title: string;
    subTitle: string;
    content: string;
    mainImage: string;
    publishedByUserId: string;
    editedByUserId: string;
    publishedDate: Date;
    updatedDate: Date;
    isHighlight: boolean;
    url: string;
    AuthorsOnReports: AuthorsOnReports[];
}
