import { prisma } from "../../lib/prisma";


export class AppointmentRepository{
    constructor(
        private readonly db: typeof prisma = prisma
    ){}

    
}