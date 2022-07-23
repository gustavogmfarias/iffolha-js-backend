declare namespace Express {
    export interface Request {
        user: {
            id: string;
        };
        log: {
            logRepository: string;
            description: string;
            modelEditedId: string;
        };
    }
}
