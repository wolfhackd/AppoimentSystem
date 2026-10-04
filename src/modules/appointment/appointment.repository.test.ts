import { describe, expect, it, vi } from "vitest";
import { prisma } from "../../lib/prisma";
import { AppointmentRepository } from "./appointment.repository";

describe("AppointmentRepository", () => {
    const input = {
        establishmentId: "establishment-id",
        serviceId: "service-id",
        hour: "10:00",
        name: "Cliente Teste",
        cpf: "12345678901",
        phone: "11999999999",
        email: "cliente@example.com",
        dayOfWeek: 1,
    };

    function setupRepository(existingAppointments: unknown[] = []) {
        const tx = {
            appointment: {
                findMany: vi.fn().mockResolvedValue(existingAppointments),
                create: vi.fn().mockResolvedValue({ id: "appointment-id" }),
            },
        };
        const db = {
            $transaction: vi.fn((callback: (transaction: typeof tx) => Promise<unknown>) => callback(tx)),
        } as unknown as typeof prisma;

        return {
            repository: new AppointmentRepository(db),
            db,
            tx,
        };
    }

    it("checks for overlaps and persists the client and appointment relations in one transaction", async () => {
        const { repository, db, tx } = setupRepository();
        const appointmentDate = new Date("2026-10-05T10:00:00.000Z");

        await repository.create(input, appointmentDate, 60);

        expect(tx.appointment.findMany).toHaveBeenCalledWith({
            where: {
                establishmentId: input.establishmentId,
                data: {
                    gte: new Date("2026-10-05T00:00:00.000Z"),
                    lt: new Date("2026-10-06T00:00:00.000Z"),
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
        expect(tx.appointment.create).toHaveBeenCalledWith({
            data: {
                data: appointmentDate,
                establishment: { connect: { id: input.establishmentId } },
                service: { connect: { id: input.serviceId } },
                client: {
                    connectOrCreate: {
                        where: { cpf: input.cpf },
                        create: {
                            name: input.name,
                            cpf: input.cpf,
                            phone: input.phone,
                            email: input.email,
                        },
                    },
                },
            },
        });
        expect(db.$transaction).toHaveBeenCalledWith(
            expect.any(Function),
            { isolationLevel: "Serializable" },
        );
    });

    it("rejects overlapping appointments without creating another record", async () => {
        const existingAppointment = {
            data: new Date("2026-10-05T10:30:00.000Z"),
            service: { duration: 30 },
        };
        const { repository, tx } = setupRepository([existingAppointment]);

        await expect(
            repository.create(input, new Date("2026-10-05T10:00:00.000Z"), 60),
        ).rejects.toThrow("Appointment time is already booked!");
        expect(tx.appointment.create).not.toHaveBeenCalled();
    });
});
