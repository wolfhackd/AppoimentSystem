import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateServiceInputDTO, CreateServiceInputWithOwnerIdDTO, DeleteServiceInputDTO, DeleteServiceWithOwnerIdDTO, UpdateServiceInputDTO, UpdateServiceWithOwnerIdDTO } from "./service.types";
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

    async updateService(request: FastifyRequest, reply: FastifyReply){
        try{
            const data = request.body as UpdateServiceInputDTO;
            const ownerId = request.user.id as string;
            const payload: UpdateServiceWithOwnerIdDTO = {...data, ownerId};
            const updatedService = await this.service.updateService(payload);

            return reply.status(200).send({
                message: "Service updated successfully",
                service: updatedService,
            });
        }catch(error: any){
            console.log(error);
            return reply.status(400).send({message: "Error to update service", error: error.message});
        }
    }

    async deleteService(request: FastifyRequest, reply: FastifyReply){
        try{
            const data = request.body as DeleteServiceInputDTO;
            const ownerId = request.user.id as string;
            const payload: DeleteServiceWithOwnerIdDTO = {...data, ownerId};
            await this.service.deleteService(payload);

            return reply.status(200).send({message: "Service deleted successfully"});
        }catch(error: any){
            console.log(error);
            return reply.status(400).send({message: "Error to delete service", error: error.message});
        }
    }

}