import {prisma} from "../../lib/prisma";
import type { CreateServiceInputDTO } from "./service.types";


export class ServiceRepository{
    constructor(private db: typeof prisma = prisma){}

    async getEstablishmentByIdAndOwner(establishId: string, ownerId: string){
        return this.db.establishment.findUnique({
            where:{
                id:establishId,
                ownerId,
            }
        })
    }

    async createService(data: CreateServiceInputDTO){
        return this.db.service.create({
            data:{
                name:data.name,
                description:data.description,
                price:data.price,
                duration:data.duration,
                establishment:{
                    connect: {
                        id: data.establishId,
                    }
                }
            }
        })
    }

    async getServiceById(id:string){
        return this.db.service.findUnique({
            where:{
                id,
            }
        })
    }

    async updateService(id: string, data: {
        name?: string;
        description?: string | null;
        price?: number;
        duration?: number;
    }){
        return this.db.service.update({
            where: { id },
            data,
        })
    }

    async deleteService(id: string){
        return this.db.service.delete({
            where: { id },
        })
    }
}