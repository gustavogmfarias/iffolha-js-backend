import { container } from "tsyringe";
import "./providers";
import { UsersRepository } from "@modules/accounts/repositories/infra/UsersRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { UsersTokensRepository } from "@modules/accounts/repositories/infra/UsersTokensRepository";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
import { ArticleRepository } from "@modules/articles/repositories/infra/ArticleRepository";
import { IArticleImagesRepository } from "@modules/articles/repositories/IArticleImagesRepository";
import { ArticleImagesRepository } from "@modules/articles/repositories/infra/ArticleImagesRepository";
import { IAuthorsRepository } from "@modules/articles/repositories/IAuthorsRepository";
import { AuthorsRepository } from "@modules/articles/repositories/infra/AuthorsRepository";
import { ITagsRepository } from "@modules/articles/repositories/ITagsRepository";
import { TagsRepository } from "@modules/articles/repositories/infra/TagsRepository";
import { ICoursesRepository } from "@modules/articles/repositories/ICoursesRepository";
import { CoursesRepository } from "@modules/articles/repositories/infra/CoursesRepository";
import { IClassesRepository } from "@modules/articles/repositories/IClassesRepository";
import { ClassesRepository } from "@modules/articles/repositories/infra/ClassesRepository";
import { ICategoriesRepository } from "@modules/articles/repositories/ICategoriesRepository";
import { CategoriesRepository } from "@modules/articles/repositories/infra/CategoriesRepository";
import { ITextualGenreRepository } from "@modules/articles/repositories/ITextualGenreRepository";
import { TextualGenreRepository } from "@modules/articles/repositories/infra/TextualGenreRepository";

container.registerSingleton<IUsersRepository>(
    "UsersRepository",
    UsersRepository
);

container.registerSingleton<IUsersTokensRepository>(
    "UsersTokensRepository",
    UsersTokensRepository
);

container.registerSingleton<IArticleRepository>(
    "ArticleRepository",
    ArticleRepository
);

container.registerSingleton<IArticleImagesRepository>(
    "ArticleImagesRepository",
    ArticleImagesRepository
);

container.registerSingleton<IAuthorsRepository>(
    "AuthorsRepository",
    AuthorsRepository
);

container.registerSingleton<ICoursesRepository>(
    "CoursesRepository",
    CoursesRepository
);

container.registerSingleton<IClassesRepository>(
    "ClassesRepository",
    ClassesRepository
);

container.registerSingleton<ITagsRepository>("TagsRepository", TagsRepository);

container.registerSingleton<ICategoriesRepository>(
    "CategoriesRepository",
    CategoriesRepository
);

container.registerSingleton<ITextualGenreRepository>(
    "TextualGenreRepository",
    TextualGenreRepository
);
