import type { FastifyReply } from "fastify/types/reply";
import type { FastifyRequest } from "fastify/types/request";
import type { createAppointmentInput } from "./appointment.types";
import type { AppointmentService } from "./appointment.service";



export class AppointmentController{

    constructor(
        private readonly appointmentService: AppointmentService,
       
    ){}

    async createAppointment(request: FastifyRequest, reply: FastifyReply){

        try{
            const data = request.body as createAppointmentInput;

            await this.appointmentService.create(data)

            reply.status(200).send({message:'Appointment created successfully'});

        }catch(error:any){
            console.log(error); 
            reply.status(400).send({error:'Error to create appointment', message: error.message});
        }

    }
}