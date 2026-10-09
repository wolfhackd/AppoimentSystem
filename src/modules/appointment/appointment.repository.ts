import { prisma } from "../../lib/prisma";
import type { CreateAppointmentInput } from "./appointment.types";


export class AppointmentRepository{
    constructor(
        private readonly db: typeof prisma = prisma
    ){}

    async create(
        data: CreateAppointmentInput,
        appointmentDate: Date,
        serviceDuration: number,
    ){
        const dayStart = new Date(appointmentDate);
        dayStart.setUTCHours(0, 0, 0, 0);

        const nextDayStart = new Date(dayStart);
        nextDayStart.setUTCDate(nextDayStart.getUTCDate() + 1);

        return this.db.$transaction(async (tx) => {
            const appointments = await tx.appointment.findMany({
                where: {
                    establishmentId: data.establishmentId,
                    data: {
                        gte: dayStart,
                        lt: nextDayStart,
                    },
                },
                include: {
                    service: {
                        select: {
                            duration: true,
                        },
                    },
                },
            });

            const appointmentEnd = appointmentDate.getTime() + serviceDuration * 60_000;
            const hasConflict = appointments.some((appointment) => {
                const existingStart = appointment.data.getTime();

                if (existingStart === appointmentDate.getTime()) {
                    return true;
                }

                if (!appointment.service) {
                    return false;
                }

                const existingEnd = existingStart + appointment.service.duration * 60_000;
                return appointmentDate.getTime() < existingEnd && existingStart < appointmentEnd;
            });

            if (hasConflict) {
                throw new Error("Appointment time is already booked!");
            }

            return tx.appointment.create({
                data: {
                    data: appointmentDate,
                    establishment: {
                        connect: { id: data.establishmentId },
                    },
                    service: {
                        connect: { id: data.serviceId },
                    },
                    client: {
                        connectOrCreate: {
                            where: { cpf: data.cpf },
                            create: {
                                name: data.name,
                                cpf: data.cpf,
                                phone: data.phone,
                                email: data.email,
                            },
                        },
                    },
                },
            });
        }, {
            isolationLevel: "Serializable",
        });
    }

    async deleteByIdAndCpf(appointmentId: string, cpf: string) {
        const result = await this.db.appointment.deleteMany({
            where: {
                id: appointmentId,
                client: {
                    is: { cpf },
                },
            },
        });

        if (result.count === 0) {
            throw new Error("Appointment not found for this client");
        }

        return result;
    }

}