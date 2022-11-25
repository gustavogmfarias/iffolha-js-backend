export interface ICreateArticleDTO {
    title: string;
    subTitle: string;
    content: string;
    publishedByUserId?: string;
    editedByUserId?: string;
    isHighlight: boolean;
    url: string;
}
