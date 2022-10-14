export interface IArticleResponseDTO {
    title: string;
    subTitle: string;
    content: string;
    publishedByUserId: string;
    isHighlight: boolean;
    url: string;
    TagsOnArticles: string[];
    AuthorsOnArticles: string[];
}
