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
class CreateTextualGenreUseCase {
    constructor(
        @inject("TextualGenreRepository")
        private textualGenreRepository: ITextualGenreRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(name: string, userAdminId: string): Promise<IResponse> {
        let textualGenre =
            await this.textualGenreRepository.findTextualGenreByName(name);

        if (textualGenre) {
            throw new AppError("Textual Genre already exists", 400);
        }

        try {
            textualGenre = await this.textualGenreRepository.createTextualGenre(
                name
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "TEXTUALGENRE",
            description: `Textual Genre created successfully!`,
            previousContent: JSON.stringify(textualGenre),
            contentEdited: JSON.stringify(textualGenre),
            editedByUserId: userAdminId,
            modelEditedId: textualGenre.id,
        });

        return { textualGenre, log };
    }
}

export { CreateTextualGenreUseCase };
