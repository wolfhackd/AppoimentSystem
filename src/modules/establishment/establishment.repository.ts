import type { CreateEstablishmentDTO } from "./establishment.types";
import { prisma } from "../../lib/prisma"


export class EstablishmentRepository{
    constructor(private db: typeof prisma = prisma){}

    async createEstablishment(data: CreateEstablishmentDTO){
        console.log("dois");
        console.log(data);
        return this.db.establishment.create({
            data:{
                name: data.name,
                email: data.email,
                phone: data.phone,
                owner:{
                    connect: {
                        id: data.ownerId
                    }
                },
            }
        })
    }

    async getEstablishmentByEmail(email:string){
        return this.db.establishment.findUnique({
            where:{
                email
            }
        });
    }
} 