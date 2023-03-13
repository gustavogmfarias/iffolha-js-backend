import { ITextualGenreRepository } from "@modules/textualGenre/repositories/ITextualGenreRepository";
import { TextualGenre, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    textualGenre: TextualGenre;
    log: Log;
}

@injectable()
class UpdateTextualGenreUseCase {
    constructor(
        @inject("TextualGenreRepository")
        private textualGenreRepository: ITextualGenreRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        id: string,
        name: string,
        userAdminId: string
    ): Promise<IResponse> {
        let textualGenre =
            await this.textualGenreRepository.findTextualGenreByName(name);
        const textualGenreToUpdate =
            await this.textualGenreRepository.findTextualGenreById(id);

        if (textualGenre) {
            throw new AppError("Textual Genre already exists", 400);
        }

        try {
            textualGenre = await this.textualGenreRepository.update(id, name);
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "TEXTUALGENRE",
            description: `Textual Genre updated successfully!`,
            previousContent: JSON.stringify(textualGenreToUpdate),
            contentEdited: JSON.stringify(textualGenre),
            editedByUserId: userAdminId,
            modelEditedId: textualGenre.id,
        });

        return { textualGenre, log };
    }
}

export { UpdateTextualGenreUseCase };
