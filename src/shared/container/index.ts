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
import { ITagsRepository } from "@modules/tags/repositories/ITagsRepository";
import { TagsRepository } from "@modules/tags/repositories/infra/TagsRepository";
import { IClassesRepository } from "@modules/classes/repositories/IClassesRepository";
import { ClassesRepository } from "@modules/classes/repositories/infra/ClassesRepository";

import { CategoriesRepository } from "@modules/categories/repositories/infra/CategoriesRepository";
import { ICategoriesRepository } from "@modules/categories/repositories/ICategoriesRepository";
import { ITextualGenreRepository } from "@modules/textualGenre/repositories/ITextualGenreRepository";
import { TextualGenreRepository } from "@modules/textualGenre/repositories/infra/TextualGenreRepository.ts";

import { ICoursesRepository } from "@modules/courses/repositories/ICoursesRepository";
import { CoursesRepository } from "@modules/courses/repositories/infra/CoursesRepository";
import { ISchoolLevelRepository } from "@modules/schoolLevel/repositories/ISchoolLevelRepository";
import { SchoolLevelRepository } from "@modules/schoolLevel/repositories/infra/SchoolLevelRepository";
import { ISocialMediaRepository } from "@modules/socialMedia/repositories/ISocialMediaRepository";
import { SocialMediaRepository } from "@modules/socialMedia/repositories/infra/SocialMediaRepository";

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

container.registerSingleton<ICoursesRepository>(
    "CoursesRepository",
    CoursesRepository
);
container.registerSingleton<ISchoolLevelRepository>(
    "SchoolLevelRepository",
    SchoolLevelRepository
);
container.registerSingleton<ISocialMediaRepository>(
    "SocialMediaRepository",
    SocialMediaRepository
);
