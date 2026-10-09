import type { FastifyReply } from "fastify/types/reply";
import type { FastifyRequest } from "fastify/types/request";
import type { CreateAppointmentInput, DeleteAppointmentInput, UpdateAppointmentInput } from "./appointment.types";
import type { AppointmentService } from "./appointment.service";


export class AppointmentController{

    constructor(
        private readonly appointmentService: AppointmentService,
       
    ){}

    async createAppointment(request: FastifyRequest, reply: FastifyReply){

        try{
            const data = request.body as CreateAppointmentInput;

            await this.appointmentService.create(data)

            reply.status(200).send({message:'Appointment created successfully'});

        }catch(error:any){
            console.log(error); 
            reply.status(400).send({error:'Error to create appointment', message: error.message});
        }

    }

    async updateAppointment(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body as UpdateAppointmentInput;
            const updatedAppointment = await this.appointmentService.update(data);

            return reply.status(200).send({
                message: "Appointment updated successfully",
                appointment: updatedAppointment,
            });
        } catch (error: any) {
            console.log(error);
            return reply.status(400).send({
                error: "Error to update appointment",
                message: error.message,
            });
        }
    }

    async deleteAppointment(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body as DeleteAppointmentInput;
            await this.appointmentService.delete(data);

            return reply.status(200).send({ message: "Appointment deleted successfully" });
        } catch (error: any) {
            console.log(error);
            return reply.status(400).send({
                error: "Error to delete appointment",
                message: error.message,
            });
        }
    }
}