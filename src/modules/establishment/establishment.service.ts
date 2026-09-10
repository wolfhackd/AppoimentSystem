import type { OwnerRepository } from "../owner/owner.repository";
import type { EstablishmentRepository } from "./establishment.repository";
import type { CreateEstablishmentDTO } from "./establishment.types";



export class EstablishmentService {
    constructor(private repository: EstablishmentRepository, private ownerRepository: OwnerRepository){}

    async createEstablishment(data:CreateEstablishmentDTO){
        const owner = await this.ownerRepository.getOwnerById(data.ownerId);
        if(!owner){
            throw new Error("Owner not found!");
        }
        
        const establishment = await this.repository.getEstablishmentByEmail(data.email);
        if(establishment){
            throw new Error("Establishment already exists!");
        }
        
        return await this.repository.createEstablishment(data);
    }
}