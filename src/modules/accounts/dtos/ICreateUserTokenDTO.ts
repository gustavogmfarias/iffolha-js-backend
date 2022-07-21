interface ICreateUserTokenDTO {
    userId: string;
    expiresDate: Date;
    refreshToken: string;
    token: string;
}

export { ICreateUserTokenDTO };
