import { Article } from "@prisma/client";
import { instanceToInstance } from "class-transformer";
import { IArticleResponseDTO } from "../dtos/IArticleResponseDTO";

class ArticleMap {
    static toDTO(
        {
            id,
            title,
            subTitle,
            content,
            publishedByUserId,
            isHighlight,
            url,
        }: Article,
        tags: string[],
        authors: string[],
        courses: string[],
        classes: string[],
        images: string[]
    ): IArticleResponseDTO {
        const article = instanceToInstance({
            id,
            title,
            subTitle,
            content,
            publishedByUserId,
            isHighlight,
            url,
            TagsOnArticles: tags,
            AuthorsOnArticles: authors,
            CoursesOnArticles: courses,
            ClassesOnArticles: classes,
            images,
        });
        return article;
    }
}

export { ArticleMap };
