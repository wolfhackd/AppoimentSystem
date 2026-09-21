import type { FastifyReply, FastifyRequest } from "fastify";
import type { EstablishmentService } from "./establishment.service";
import type { CreateEstablishmentInputDTO, CreateEstablishmentWithOwnerIdInputDTO, RegisterBusinessHourInputDTO, RegisterBusinessHourWithOwnerIdInputDTO } from "./establishment.types";




export class EstablishmentController {
    constructor(private service: EstablishmentService){}

    async createEstablishment(request: FastifyRequest, reply: FastifyReply) {
        try{

            const data = request.body as CreateEstablishmentInputDTO;
            
            const ownerId = request.user.id as string;

            const payload: CreateEstablishmentWithOwnerIdInputDTO = {...data, ownerId};
            const newEstablishment = await this.service.createEstablishment(payload);
            return reply.status(201).send({message: newEstablishment.name + " Establishment created successfully!"})

        }catch(error:any){
            return reply.status(400).send({message: "Error creating establishment!", error: error.message})
        }
        
    }

    async registerBusinessHour(request: FastifyRequest, reply: FastifyReply){
        try {
            const data = request.body as RegisterBusinessHourInputDTO;

            //Verificar se ele é o dono do estabelecimento
            //é interessante olhar se é possível registrar hórarios dentro dos que já tem

            const ownerId = request.user.id as string;

            const payload: RegisterBusinessHourWithOwnerIdInputDTO = {...data, ownerId};

            await this.service.registerBusinessHour(payload);
            return reply.status(201).send({message: "Business hour registered successfully!"})

        } catch (error:any) {
            return reply.status(400).send({message: "Error registering business hour!", error: error.message})
        }
    }
}