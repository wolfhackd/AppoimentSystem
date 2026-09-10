import { prisma } from "../../lib/prisma"
import type { CreateOwnerDTO } from "./owner.types";

export class OwnerRepository {
    constructor(private db: typeof prisma = prisma){}

    async createOwner(data: CreateOwnerDTO){
        return this.db.owner.create({
            data:data
        })
    }

    async getOwnerByEmail(email:string){
        return this.db.owner.findFirst({where:{email}});
    }

    async getOwnerByCpf(cpf:string){
        return this.db.owner.findFirst({where:{cpf}});
    }

    async getOwnerById(id:string){
        return this.db.owner.findFirst({where:{id}});
    }
}
