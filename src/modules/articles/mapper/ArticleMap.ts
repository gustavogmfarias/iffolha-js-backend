import { Article } from "@prisma/client";
import { instanceToInstance } from "class-transformer";
import { IArticleResponseDTO } from "../dtos/IArticleResponseDTO";

class ArticleMap {
    static toDTO(
        {
            title,
            subTitle,
            content,
            publishedByUserId,
            isHighlight,
            url,
        }: Article,
        tags: string[]
    ): IArticleResponseDTO {
        const article = instanceToInstance({
            title,
            subTitle,
            content,
            publishedByUserId,
            isHighlight,
            url,
            TagsOnArticles: tags,
        });
        return article;
    }
}

export { ArticleMap };
