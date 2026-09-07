
import { db as DataBase } from "../../prisma/db";
import type { CreateOwnerDTO } from "./owner.types";

export class OwnerRepository {
    constructor(private db: typeof DataBase){}

    async createOwner(data: CreateOwnerDTO){
        return this.db.orm.public.Owner.create(data);
    }

    async getOwnerByEmail(email:string){
        return this.db.orm.public.Owner.where({email})
    }

    async getOwnerByCpf(cpf:string){
        return this.db.orm.public.Owner.where({cpf})
    }
}
