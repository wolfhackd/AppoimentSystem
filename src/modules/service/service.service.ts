import type { ServiceRepository } from "./service.repository";
import type { CreateServiceInputWithOwnerIdDTO, DeleteServiceWithOwnerIdDTO, UpdateServiceWithOwnerIdDTO } from "./service.types";




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

    async updateService(data: UpdateServiceWithOwnerIdDTO){
        const existingService = await this.repository.getServiceById(data.serviceId);
        if(!existingService){
            throw new Error("Service not found!");
        }

        const establishment = await this.repository.getEstablishmentByIdAndOwner(
            existingService.establishmentId,
            data.ownerId
        );
        if(!establishment){
            throw new Error("User is not the owner of the establishment!");
        }

        const updateData = Object.fromEntries(
            Object.entries({
                name: data.name,
                description: data.description,
                price: data.price,
                duration: data.duration,
            }).filter(([, value]) => value !== undefined)
        );

        return this.repository.updateService(data.serviceId, updateData);
    }

    async deleteService(data: DeleteServiceWithOwnerIdDTO){
        const existingService = await this.repository.getServiceById(data.serviceId);
        if(!existingService){
            throw new Error("Service not found!");
        }

        const establishment = await this.repository.getEstablishmentByIdAndOwner(
            existingService.establishmentId,
            data.ownerId
        );
        if(!establishment){
            throw new Error("User is not the owner of the establishment!");
        }

        return this.repository.deleteService(data.serviceId);
    }

}