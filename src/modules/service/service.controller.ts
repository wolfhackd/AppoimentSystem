import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateServiceInputDTO, CreateServiceInputWithOwnerIdDTO } from "./service.types";
import type { ServiceService } from "./service.service";


export class ServiceController{
    constructor(private service: ServiceService){}

    async createService(request: FastifyRequest, reply: FastifyReply){
        try{
            const data = request.body as CreateServiceInputDTO

            const ownerId = request.user.id as string;

            const payload = {
                ...data,
                ownerId: ownerId,
            } as CreateServiceInputWithOwnerIdDTO;


            await this.service.createService(payload);
            return reply.status(201).send({message: "Service created successfully"});

        }catch(error: any){
            console.log(error);
            return reply.status(400).send({message: "Error to create service", error: error.message});
        }
        
        
    }

}