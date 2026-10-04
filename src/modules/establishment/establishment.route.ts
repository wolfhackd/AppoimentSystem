import type { FastifyInstance } from "fastify";
import { EstablishmentController } from "./establishment.controller";
import { EstablishmentService } from "./establishment.service";
import { EstablishmentRepository } from "./establishment.repository";
import {repository as ownerRepository} from "../owner/owner.route";
import { authMiddleware } from "../../middleware/middleware";
import { CreateEstablishmentSchema, GetEstablishmentByIdParamsSchema, RegisterBusinessHourSchema, UpdateEstablishmentSchema } from "./establishment.types";

export const repository = new EstablishmentRepository();
export const service = new EstablishmentService(repository,ownerRepository);
const controller = new EstablishmentController(service);

export const establishmentRoute = async (app: FastifyInstance) => {
    app.get("/:id", {
        schema: {
            params: GetEstablishmentByIdParamsSchema,
        },
    }, controller.getEstablishmentById.bind(controller));
    app.post("/create",{preHandler: authMiddleware, schema:{
        body: CreateEstablishmentSchema,
    }},controller.createEstablishment.bind(controller));
    app.patch("/update",{preHandler: authMiddleware, schema:{
        body: UpdateEstablishmentSchema,
    }},controller.updateEstablishment.bind(controller));
    app.put("/update",{preHandler: authMiddleware, schema:{
        body: UpdateEstablishmentSchema,
    }},controller.updateEstablishment.bind(controller));
    app.patch("/edit",{preHandler: authMiddleware, schema:{
        body: UpdateEstablishmentSchema,
    }},controller.editEstablishment.bind(controller));
    app.post("/register-hour",{preHandler: authMiddleware,
        schema:{
            body: RegisterBusinessHourSchema
        }
    },controller.registerBusinessHour.bind(controller));
}
