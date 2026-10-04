import { afterEach, beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import type { AppointmentRepository } from "./appointment.repository";
import type { EstablishmentService } from "../establishment/establishment.service";
import type { ServiceService } from "../service/service.service";
import { AppointmentService } from "./appointment.service";

describe("AppointmentService", () => {
    let service: AppointmentService;
    let appointmentRepository: Mocked<AppointmentRepository>;
    let establishmentService: Mocked<EstablishmentService>;
    let serviceService: Mocked<ServiceService>;

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

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-04T12:00:00.000Z"));

        appointmentRepository = {
            create: vi.fn(),
        } as unknown as Mocked<AppointmentRepository>;
        establishmentService = {
            getEstablishmentById: vi.fn().mockResolvedValue({ id: input.establishmentId }),
            isOpenInDay: vi.fn().mockResolvedValue([
                { openingTime: "09:00", closingTime: "17:00" },
            ]),
        } as unknown as Mocked<EstablishmentService>;
        serviceService = {
            getServiceById: vi.fn().mockResolvedValue({
                id: input.serviceId,
                establishmentId: input.establishmentId,
                duration: 60,
            }),
        } as unknown as Mocked<ServiceService>;

        service = new AppointmentService(
            appointmentRepository,
            establishmentService,
            serviceService,
        );
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("creates an appointment for the next occurrence and returns the persisted record", async () => {
        const createdAppointment = {
            id: "appointment-id",
            data: new Date("2026-10-05T10:00:00.000Z"),
        };
        appointmentRepository.create.mockResolvedValue(createdAppointment as never);

        const result = await service.create(input);

        expect(appointmentRepository.create).toHaveBeenCalledWith(
            input,
            new Date("2026-10-05T10:00:00.000Z"),
            60,
        );
        expect(result).toBe(createdAppointment);
    });

    it("moves a same-day appointment to the following week when its time has passed", async () => {
        vi.setSystemTime(new Date("2026-10-05T10:01:00.000Z"));
        appointmentRepository.create.mockResolvedValue({ id: "appointment-id" } as never);

        await service.create(input);

        expect(appointmentRepository.create).toHaveBeenCalledWith(
            input,
            new Date("2026-10-12T10:00:00.000Z"),
            60,
        );
    });

    it("rejects services that belong to another establishment", async () => {
        serviceService.getServiceById.mockResolvedValue({
            id: input.serviceId,
            establishmentId: "different-establishment",
            duration: 60,
        } as never);

        await expect(service.create(input)).rejects.toThrow(
            "Service does not belong to this establishment!",
        );
        expect(appointmentRepository.create).not.toHaveBeenCalled();
    });

    it("rejects appointments that do not fit within an open interval", async () => {
        await expect(service.create({ ...input, hour: "16:30" })).rejects.toThrow(
            "Appointment time is outside of establishment operating hours for this day!",
        );
        expect(appointmentRepository.create).not.toHaveBeenCalled();
    });
});
