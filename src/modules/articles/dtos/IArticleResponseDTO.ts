export interface IArticleResponseDTO {
    id: string;
    title: string;
    subTitle: string;
    content: string;
    publishedByUserId: string;
    isHighlight: boolean;
    url: string;
    TagsOnArticles?: string[];
    CategoryOnArticles?: string[];
    AuthorsOnArticles?: string[];
    CoursesOnArticles?: string[];
    ClassesOnArticles?: string[];
    images?: string[];
}
