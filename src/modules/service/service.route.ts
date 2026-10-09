import type { FastifyInstance } from "fastify/types/instance";
import { ServiceController } from "./service.controller";
import { ServiceService } from "./service.service";
import { ServiceRepository } from "./service.repository";
import { authMiddleware } from "../../middleware/middleware";
import { CreateServiceInputSchema, DeleteServiceSchema, UpdateServiceSchema } from "./service.types";

const serviceRepository = new ServiceRepository()
export const service = new ServiceService(serviceRepository)
const controller = new ServiceController(service)

export const serviceRouter = (app: FastifyInstance) => {
    app.post('/create',{preHandler:authMiddleware, schema:{body:CreateServiceInputSchema}},controller.createService.bind(controller))
    app.patch('/edit',{preHandler:authMiddleware, schema:{body:UpdateServiceSchema}},controller.updateService.bind(controller))
    app.delete('/delete',{preHandler:authMiddleware, schema:{body:DeleteServiceSchema}},controller.deleteService.bind(controller))
} 