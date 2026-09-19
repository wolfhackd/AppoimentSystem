import type { FastifyInstance } from "fastify";
import { EstablishmentController } from "./establishment.controller";
import { EstablishmentService } from "./establishment.service";
import { EstablishmentRepository } from "./establishment.repository";
import {repository as ownerRepository} from "../owner/owner.route";
import { authMiddleware } from "../../middleware/middleware";

export const repository = new EstablishmentRepository();
export const service = new EstablishmentService(repository,ownerRepository);
const controller = new EstablishmentController(service);

export const establishmentRoute = async (app: FastifyInstance) => {
    app.post("/create",{preHandler: authMiddleware},controller.createEstablishment.bind(controller));
    app.post("/register-hour",{preHandler: authMiddleware},controller.registerBusinessHour.bind(controller));
}
