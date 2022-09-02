import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-Memory/UsersRepositoryInMemory";
import { LogProvider } from "@shared/container/providers/LogProvider/implementations/LogProvider";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { CreateUserUseCase } from "../CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let logProvider: LogProvider;

describe("Create an User In Memory", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        logProvider = new LogProvider();
        createUserUseCase = new CreateUserUseCase(
            usersRepositoryInMemory,
            logProvider
        );
    });

    it("Should be able to create a new user", async () => {
        const passwordAdmin = await hash("admin", 12);
        const userAdminId = await uuidv4();

        const user = await createUserUseCase.execute(userAdminId, {
            name: "Admin",
            lastName: "Trador",
            password: passwordAdmin,
            email: "admin@admin.com",
            role: "ADMIN",
        });

        const userCreated = await usersRepositoryInMemory.findByEmail(
            user.email
        );

        expect(userCreated).toHaveProperty("id");
    });
});
