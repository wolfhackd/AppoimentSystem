import type { FastifyInstance } from "fastify";
import { OwnerController } from "./owner.controller";
import { OwnerService } from "./owner.service";
import { OwnerRepository } from "./owner.repository";
import { CreateOwnerSchema, LoginOwnerSchema } from "./owner.types";

export const repository = new OwnerRepository();
const service = new OwnerService(repository);
const controller = new OwnerController(service);

export const ownerRoute = async (app: FastifyInstance) =>{

    app.post("/create",{
        schema:{body:CreateOwnerSchema}
    }, controller.createOwner.bind(controller));
    app.post("/login",{schema:{body:LoginOwnerSchema}}, controller.login.bind(controller));
}