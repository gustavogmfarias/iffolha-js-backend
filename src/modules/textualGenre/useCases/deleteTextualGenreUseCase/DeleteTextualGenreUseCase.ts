import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ITextualGenreRepository } from "@modules/textualGenre/repositories/ITextualGenreRepository";
import { Log, TextualGenre, User } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    textualGenre: TextualGenre;
    log: Log;
}

@injectable()
class DeleteTextualGenreUseCase {
    constructor(
        @inject("TextualGenreRepository")
        private textualGenreRepository: ITextualGenreRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        textualGenreToDeleteId: string
    ): Promise<IResponse> {
        const textualGenre =
            await this.textualGenreRepository.findTextualGenreById(
                textualGenreToDeleteId
            );

        if (!textualGenre) {
            throw new AppError("TextualGenre doesn't exists", 404);
        }
        let textualGenreDeleted;

        try {
            textualGenreDeleted =
                this.textualGenreRepository.deleteTextualGenre(
                    textualGenreToDeleteId
                );
        } catch (err) {
            throw new AppError("TextualGenre wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "TEXTUALGENRE",
            description: `TextualGenre successfully deleted!`,
            previousContent: JSON.stringify(textualGenre),
            contentEdited: JSON.stringify(textualGenre),
            editedByUserId: userAdminId,
            modelEditedId: textualGenre.id,
        });

        return { textualGenre, log };
    }
}

export { DeleteTextualGenreUseCase };
