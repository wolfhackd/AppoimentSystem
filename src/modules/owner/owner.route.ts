import type { FastifyInstance } from "fastify";
import { OwnerController } from "./owner.controller";
import { OwnerService } from "./owner.service";
import { OwnerRepository } from "./owner.repository";

export const repository = new OwnerRepository();
const service = new OwnerService(repository);
const controller = new OwnerController(service);

export const ownerRoute = async (app: FastifyInstance) =>{

    app.post("/create", controller.createOwner.bind(controller));
    app.post("/login", controller.login.bind(controller));
}