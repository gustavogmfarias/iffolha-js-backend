/* eslint-disable array-callback-return */
/* eslint-disable no-return-await */
import { inject, injectable } from "tsyringe";
import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
import { Article, TagsOnArticles } from "@prisma/client";
import { IArticleResponseDTO } from "@modules/articles/dtos/IArticleResponseDTO";
import { ITagsRepository } from "@modules/articles/repositories/ITagsRepository";

@injectable()
class ListArticlesUseCase {
    constructor(
        @inject("ArticleRepository")
        private articleRepository: IArticleRepository,
        @inject("TagsRepository")
        private tagsRepository: ITagsRepository
    ) {}

    async execute({
        page,
        perPage,
    }: IPaginationRequestDTO): Promise<IArticleResponseDTO[]> {
        const articles: Article[] = await this.articleRepository.list({
            page,
            perPage,
        });

        const articlesDTO: IArticleResponseDTO[] = [];

        articles.map((article) => {
            const TagsOnArticle: string[] = [];
            const AuthorsOnArticle: string[] = [];
            const CoursesOnArticle: string[] = [];
            const ClassesOnArticle: string[] = [];
            const CategoriesOnArticle: string[] = [];
            const TextualGenresOnArticle: string[] = [];
            const images: string[] = [];

            article.TagsOnArticles.map((data) => {
                const tagName = data.tag.name;

                TagsOnArticle.push(data.tag.name);
            });

            article.CategoryOnArticles.map((data) => {
                const categoryName = data.category.name;

                CategoriesOnArticle.push(categoryName);
            });

            article.TextualGenreOnArticles.map((data) => {
                const textualGenreName = data.textualGenre.name;

                TextualGenresOnArticle.push(textualGenreName);
            });

            article.AuthorsOnArticles.map((data) => {
                const authorName = data.author.name;

                AuthorsOnArticle.push(data.author.name);
            });

            article.CoursesOnArticles.map((data) => {
                const courseName = data.course.name;
                CoursesOnArticle.push(courseName);
            });

            article.ClassOnArticles.map((data) => {
                const className = data.class.name;
                ClassesOnArticle.push(className);
            });

            article.images.map((data) => {
                const imagesLinkName = this.articleRepository.imageUrl(
                    data.image
                );

                images.push(imagesLinkName);
            });

            const articleDTO = this.articleRepository.convertDTO(
                article,
                TagsOnArticle,
                AuthorsOnArticle,
                CoursesOnArticle,
                ClassesOnArticle,
                CategoriesOnArticle,
                TextualGenresOnArticle,
                images
            );

            articlesDTO.push(articleDTO);
        });

        return articlesDTO;
    }
}
export { ListArticlesUseCase };
