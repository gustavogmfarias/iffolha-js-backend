import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase";

class CreateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;
        const { name, password, email, avatarUrl, lastName, role } =
            request.body;
        const createUserUseCase = container.resolve(CreateUserUseCase);

        const user = await createUserUseCase.execute(userAdminId, {
            name,
            lastName,
            password,
            email,
            avatarUrl,
            role,
        });

        return response.status(201).send(user);
    }
}

export { CreateUserController };
