import type { CreateEstablishmentDTO, RegisterBusinessHourDTO } from "./establishment.types";
import { prisma } from "../../lib/prisma"


export class EstablishmentRepository{
    constructor(private db: typeof prisma = prisma){}

    async createEstablishment(data: CreateEstablishmentDTO){
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

    async getEstablishmentById(id: string){
        return this.db.establishment.findUnique({
            where:{
                id
            }
        })
    }

    async registerBusinessHour(data: RegisterBusinessHourDTO){
        return this.db.businessHour.create({
            data:{
                openingTime: data.openingTime,
                closingTime: data.closingTime,
                dayOfWeek: data.dayOfWeek,
                establishmentId: data.establishmentId,
            }
        })
    }
} 