import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateEstablishmentDTO, CreateEstablishmentInputDTO } from "./establishment.types";
import { Validator } from "../../utils/validator";
import type { EstablishmentService } from "./establishment.service";




export class EstablishmentController {
    constructor(private service: EstablishmentService){}

    async createEstablishment(request: FastifyRequest, reply: FastifyReply) {
        try{

            const data = request.body as CreateEstablishmentInputDTO;
            
            Validator.required(data.email, "Email is required");
            Validator.required(data.phone, "Phone is required");
            Validator.required(data.name, "Name is required");

            const ownerId = request.user.id as string;
            Validator.required(ownerId, "User id is required");

            const payload: CreateEstablishmentDTO = {...data, ownerId};
            const newEstablishment = await this.service.createEstablishment(payload);
            return reply.status(201).send({message: newEstablishment.name + " Establishment created successfully!"})

        }catch(error:any){
            return reply.status(400).send({message: "Error creating establishment!", error: error.message})
        }
        
    }
}