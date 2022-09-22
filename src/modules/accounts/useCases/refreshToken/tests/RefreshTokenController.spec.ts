/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { app } from "@shared/infra/http/app";
import request from "supertest";

describe("USER - Refresh token", () => {
    it("Should be able to generate a new Token by refresh token", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token, refreshToken } = responseToken.body;

        const responseRefreshToken = await request(app)
            .post("/refresh-token")
            .send({ refreshToken });

        expect(responseRefreshToken.status).toBe(200);
        expect(responseRefreshToken.body).toHaveProperty("refreshToken");
        expect(responseRefreshToken.body).toHaveProperty("token");
    });

    it("Should not be able to generate a new Token by refresh token if the previous refresh token is invalid", async () => {
        const responseRefreshToken = await request(app)
            .post("/refresh-token")
            .send({
                refreshToken:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1c3Rhdm8iLCJpYXQiOjE2NTkxNDQ1NTIsImV4cCI6MTY2MTczNjU1Miwic3ViIjoiZDJmZjMyNzAtYzZmYS00MTAzLTg0ZWMtZDhlZWZiMTBjOGZhIn0.JNr7eoaiE2WaaPVi4yx1T1goALCHWa5261OyyQwhA2I",
            });

        expect(responseRefreshToken.status).toBe(500);
    });
});
