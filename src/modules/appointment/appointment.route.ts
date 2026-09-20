import type { FastifyInstance } from "fastify/types/instance";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";
import { service as establishmentService  } from "./../establishment/establishment.route"
import { service as serviceService  } from "./../service/service.route"
import { AppointmentRepository } from "./appointment.repository";
import { createAppointmentSchema } from "./appointment.types";

const repository = new AppointmentRepository()
const service = new AppointmentService(repository, establishmentService, serviceService)
const controller = new AppointmentController(service);

export const appointmentRoute = (app: FastifyInstance) =>{
    app.post('/create',{
        schema:{
            body: createAppointmentSchema
        }
    }, controller.createAppointment.bind(controller));
}