import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateServiceDTO, CreateServiceInputDTO } from "./service.types";
import { Validator } from "../../utils/validator";
import type { ServiceService } from "./service.service";


export class ServiceController{
    constructor(private service: ServiceService){}

    async createService(request: FastifyRequest, reply: FastifyReply){
        try{
            const data = request.body as CreateServiceInputDTO
            Validator.required(data.name, "name");
            Validator.required(data.description, "description");
            Validator.required(data.price, "price");
            Validator.required(data.duration, "duration");
            Validator.required(data.establishId, "establishId");

            Validator.isNumber(data.price, "price");
            Validator.isNumber(data.duration, "duration");

            const ownerId = request.user.id as string;
            Validator.required(ownerId, "ownerId");

            const payload = {
                ...data,
                ownerId: ownerId,
            } as CreateServiceDTO;


            await this.service.createService(payload);
            return reply.status(201).send({message: "Service created successfully"});

        }catch(error: any){
            console.log(error);
            return reply.status(400).send({message: "Error to create service", error: error.message});
        }
        
        
    }

}