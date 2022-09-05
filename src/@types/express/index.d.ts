declare namespace Express {
    export interface Request {
        user: {
            id: string;
        };
        log: {
            logRepository: LogRepository;
            description: string;
            previousContent: string;
            contentEdited: string;
            editedByUserId: string;
            modelEditedId: string;
        };
    }
}
