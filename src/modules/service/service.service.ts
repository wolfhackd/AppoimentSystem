import type { OwnerRepository } from "../owner/owner.repository";
import type { ServiceRepository } from "./service.repository";
import type { CreateServiceDTO } from "./service.types";




export class ServiceService {
    constructor(private repository: ServiceRepository){}

    async createService(data: CreateServiceDTO){
        const establishment = await this.repository.getEstablishmentByIdAndOwner(
                data.establishId,
                data.ownerId
            );
        if (!establishment) {
        throw new Error(
            "Establishment not found or you are not the owner"
        );
        }


        await this.repository.createService(data);
    }

    async getServiceById(id:string){
        return this.repository.getServiceById(id);
    }

}