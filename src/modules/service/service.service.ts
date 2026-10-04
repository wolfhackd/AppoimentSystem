import type { ServiceRepository } from "./service.repository";
import type { CreateServiceInputWithOwnerIdDTO } from "./service.types";




export class ServiceService {
    constructor(private repository: ServiceRepository){}

    async createService(data: CreateServiceInputWithOwnerIdDTO){
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