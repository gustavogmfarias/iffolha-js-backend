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
