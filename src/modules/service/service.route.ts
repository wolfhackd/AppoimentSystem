import type { FastifyInstance } from "fastify/types/instance";
import { ServiceController } from "./service.controller";
import { ServiceService } from "./service.service";
import { ServiceRepository } from "./service.repository";
import { authMiddleware } from "../../middleware/middleware";

const serviceRepository = new ServiceRepository()
const service = new ServiceService(serviceRepository)
const controller = new ServiceController(service)

export const serviceRouter = (app: FastifyInstance) => {
    app.post('/create',{preHandler:authMiddleware},controller.createService.bind(controller))
}