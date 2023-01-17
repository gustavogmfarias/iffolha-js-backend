/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("TEXTUAL GENRE - Delete TextualGenre Controller", () => {
    let token: string;
    let textualGenre;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;

        textualGenre = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });
    });

    it("Should be able to delete a textualGenre", async () => {
        const responseDelete = await request(app)
            .delete(`/textualgenre/${textualGenre.body.textualGenre.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(responseDelete.body.log.description).toBe(
            "TextualGenre successfully deleted!"
        );
        expect(responseDelete.status).toBe(200);
    });

    it("Should not be able to delete a textualGenre if you was not logged", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const textualGenre2 = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        const responseDelete = await request(app).delete(
            `/textualgenre/${textualGenre2.body.textualGenre.id}`
        );

        expect(responseDelete.body.message).toBe("Token missing");
    });

    it("Should not be able to delete a textualGenre if token is invalid or expired", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const textualGenre3 = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
            });

        const responseDelete = await request(app)
            .delete(`/textualgenre/${textualGenre3.body.textualGenre.id}`)
            .set({ Authorization: `Bearer 1111` });

        expect(responseDelete.body.message).toBe("Invalid Token");
    });
});
