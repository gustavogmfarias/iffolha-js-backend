import { Article, TextualGenreOnArticles } from "@prisma/client";
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
        categories: string[],
        textualGenres: string[],
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
            CategoryOnArticles: categories,
            AuthorsOnArticles: authors,
            CoursesOnArticles: courses,
            ClassesOnArticles: classes,
            TextualGenreOnArticles: textualGenres,
            images,
        });
        return article;
    }
}

export { ArticleMap };
