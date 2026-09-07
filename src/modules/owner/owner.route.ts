import type { FastifyInstance } from "fastify";
import { OwnerController } from "./owner.controller";
import { OwnerService } from "./owner.service";
import { OwnerRepository } from "./owner.repository";
import { db } from "../../prisma/db";

const repository = new OwnerRepository(db);
const service = new OwnerService(repository);
const controller = new OwnerController(service);

export const ownerRoute = async (app: FastifyInstance) =>{

    app.post("/create", controller.createOwner.bind(controller));
    app.post("/login", controller.login.bind(controller));
}