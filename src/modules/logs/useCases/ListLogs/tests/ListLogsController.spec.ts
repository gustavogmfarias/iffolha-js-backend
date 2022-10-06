/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { prisma } from "@shared/database/prismaClient";
import { app } from "@shared/infra/http/app";
import request from "supertest";

/* eslint-disable prefer-destructuring */

jest.setTimeout(200000000);

describe("LOG - List Logs Controller", () => {
    const dateProvider = new DayjsDateProvider();
    const currentDate = dateProvider.dateNow();

    let userToken;
    let userAdmin;
    let userGustavo;
    let tokenGustavo;
    let userAngelica;
    let userMauricio;
    let dateMauricio;
    let userAndrea;

    beforeAll(async () => {
        const adminLogin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        userToken = adminLogin.body.token;

        const gustavoLogin = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@gmail.com", password: "gustavo" });
        tokenGustavo = gustavoLogin.body.token;

        userAdmin = await request(app)
            .get(`/users/findbyemail?email=admin%40admin.com`)
            .set({ Authorization: `Bearer ${userToken}` });

        userGustavo = await request(app)
            .get(`/users/findbyemail?email=gustavo@gmail.com`)
            .set({ Authorization: `Bearer ${userToken}` });

        userAngelica = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${userToken}` })
            .send({
                email: "angelica@test.com.br",
                name: "Angelica ",
                lastName: "Goulart",
                password: "test",
            });

        userMauricio = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${userToken}` })
            .send({
                email: "mauricio@test.com.br",
                name: "Maurício ",
                lastName: "Farias",
                password: "test",
            });

        dateMauricio = dateProvider.addDays(2);

        const userMauricioUpdate = await prisma.log.update({
            where: { id: userMauricio.body[1].id },
            data: {
                createdAt: dateProvider.addDays(2),
            },
        });

        userAndrea = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${userToken}` })
            .send({
                email: "andrea@test.com.br",
                name: "Andrea ",
                lastName: "Farias",
                password: "test",
            });

        const userAndreaUpdate = await prisma.log.update({
            where: { id: userAndrea.body[1].id },
            data: {
                createdAt: dateProvider.addDays(3),
            },
        });
    });

    it("Should be able to list all logs", async () => {
        const logs = await request(app)
            .get("/logs")
            .set({ Authorization: `Bearer ${userToken}` });

        expect(logs.status).toBe(200);
        expect(logs.body).toHaveLength(3);
    });

    it("Should be able to list the logs with pagination", async () => {
        const logsA = await request(app)
            .get("/logs?page=1&perPage=1")
            .set({ Authorization: `Bearer ${userToken}` });
        const logsB = await request(app)
            .get("/logs?page=1&perPage=2")
            .set({ Authorization: `Bearer ${userToken}` });
        expect(logsA.status).toBe(200);
        expect(logsA.body).toHaveLength(1);
        expect(logsB.body).toHaveLength(2);
    });

    it("Should be able to list logs by admin id", async () => {
        const logsA = await request(app)
            .get(`/logs?page&perPage&editedByUserId=${userAdmin.body.id}`)
            .set({ Authorization: `Bearer ${userToken}` });

        const logsB = await request(app)
            .get(`/logs?page&perPage&editedByUserId=${userGustavo.body.id}`)
            .set({ Authorization: `Bearer ${userToken}` });

        expect(logsA.status).toBe(200);
        expect(logsA.body).toHaveLength(3);
        expect(logsB.status).toBe(200);
        expect(logsB.body).toHaveLength(0);
    });

    it("Should be able to list logs by description", async () => {
        const newUser = await request(app)
            .post("/users")
            .send({
                email: "gustavo@test.com.br",
                name: "Gustavo",
                lastName: "Goulart",
                password: "test",
                role: "ADMIN",
            })
            .set({ Authorization: `Bearer ${userToken}` });

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${userToken}` })
            .send({
                previousPassword: "test",
                newPassword: "tiago123",
                confirmNewPassword: "tiago123",
            });

        const newUserUpdatedCreatedDateUpdated_2 = await prisma.log.update({
            // para não interferir nos testes por periodo
            where: { id: newUserUpdated.body[1].id },
            data: {
                createdAt: dateProvider.addDays(10),
            },
        });

        const newUserUpdatedCreatedDateUpdated = await prisma.log.update({
            // para não interferir nos testes por periodo
            where: { id: newUser.body[1].id },
            data: {
                createdAt: dateProvider.addDays(10),
            },
        });

        const logsA = await request(app)
            .get(
                `/logs?page&perPage&description=User%20created%20successfully!`
            )
            .set({ Authorization: `Bearer ${userToken}` });

        const logsB = await request(app)
            .get(
                `/logs?page&perPage&description=User%20successfully%20updated!`
            )
            .set({ Authorization: `Bearer ${userToken}` });

        expect(logsA.status).toBe(200);
        expect(logsA.body).toHaveLength(4);
        expect(logsB.status).toBe(200);
        expect(logsB.body).toHaveLength(1);
    });

    // it("Should be able to list logs by log repository", async () => {
    //     const newUserUpdatedCreatedDateUpdated = await prisma.log.update({
    //         // para não interferir nos testes por periodo
    //         where: { id: newUser.body[1].id },
    //         data: {
    //             createdAt: dateProvider.addDays(10),
    //         },
    //     });

    //     const logsA = await request(app)
    //         .get(`/logs?page&perPage&logRepository=USER!`)
    //         .set({ Authorization: `Bearer ${userToken}` });

    //     const logsB = await request(app)
    //         .get(`/logs?logs?page&perPage&logRepository=USER`)
    //         .set({ Authorization: `Bearer ${userToken}` });

    //     expect(logsA.status).toBe(200);
    //     expect(logsA.body).toHaveLength(5);
    //     expect(logsB.status).toBe(200);
    //     expect(logsB.body).toHaveLength(1);
    // });

    it("Should be able to list logs by period", async () => {
        const logsA = await request(app)
            .get(
                `/logs?startDate=${dateProvider.convertToUtc(
                    dateMauricio
                )}&endDate=${new Date(
                    dateProvider.convertToUtc(dateProvider.addDays(3))
                )}`
            )
            .set({ Authorization: `Bearer ${userToken}` });

        const logsB = await request(app)
            .get(
                `/logs?startDate=${dateProvider.convertToUtc(
                    currentDate
                )}&endDate=${dateProvider.convertToUtc(currentDate)}`
            )
            .set({ Authorization: `Bearer ${userToken}` });

        expect(logsA.status).toBe(200);
        expect(logsA.body).toHaveLength(2);
        expect(logsB.body).toHaveLength(1);
    });

    it("Should not be able to list the logs as if you are not logged in", async () => {
        const response = await request(app).get("/logs");

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to list logs if token is invalid or expired", async () => {
        const response = await request(app)
            .get("/logs")
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
    it("Should not be able to list logs if not an admin", async () => {
        const response = await request(app)
            .get("/logs")
            .set({ Authorization: `Bearer ${tokenGustavo}` });

        expect(response.body.message).toBe("User is not an Admin!");
    });
});
