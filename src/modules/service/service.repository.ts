import {prisma} from "../../lib/prisma";
import type { CreateServiceDTO } from "./service.types";


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

    async createService(data: CreateServiceDTO){
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
}