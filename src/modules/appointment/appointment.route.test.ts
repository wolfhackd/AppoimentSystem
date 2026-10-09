import cookie from "@fastify/cookie";
import { serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import fastify, { type FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appointmentRoute } from "./appointment.route";

const repository = vi.hoisted(() => ({
    create: vi.fn(),
    getByIdAndCpf: vi.fn(),
    updateByIdAndCpf: vi.fn(),
    deleteByIdAndCpf: vi.fn(),
}));

vi.mock("./appointment.repository", () => ({
    AppointmentRepository: class {
        create = repository.create;
        getByIdAndCpf = repository.getByIdAndCpf;
        updateByIdAndCpf = repository.updateByIdAndCpf;
        deleteByIdAndCpf = repository.deleteByIdAndCpf;
    },
}));

vi.mock("../establishment/establishment.route", () => ({ service: {} }));
vi.mock("../service/service.route", () => ({ service: {} }));

const appointmentId = "00000000-0000-4000-8000-000000000001";
const cpf = "12345678901";

describe("appointment routes", () => {
    let app: FastifyInstance;

    beforeEach(() => {
        vi.resetAllMocks();
        repository.getByIdAndCpf.mockResolvedValue({
            id: appointmentId,
            data: new Date("2026-10-05T10:00:00.000Z"),
            serviceId: "00000000-0000-4000-8000-000000000002",
            establishmentId: "00000000-0000-4000-8000-000000000003",
        });
        repository.updateByIdAndCpf.mockResolvedValue({ id: appointmentId });
        repository.deleteByIdAndCpf.mockResolvedValue({ count: 1 });

        app = fastify();
        app.register(cookie);
        app.setValidatorCompiler(validatorCompiler);
        app.setSerializerCompiler(serializerCompiler);
        appointmentRoute(app);
    });

    afterEach(async () => {
        await app.close();
    });

    it("updates an appointment by appointment ID and client CPF", async () => {
        const response = await app.inject({
            method: "PATCH",
            url: "/edit",
            payload: {
                appointmentId,
                cpf,
                hour: "11:00",
                dayOfWeek: 2,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            message: "Appointment updated successfully",
            appointment: { id: appointmentId },
        });
        expect(repository.updateByIdAndCpf).toHaveBeenCalledWith(
            appointmentId,
            cpf,
            expect.objectContaining({ data: expect.any(Date) }),
        );
    });

    it("deletes by appointment ID and the saved client CPF", async () => {
        const response = await app.inject({
            method: "DELETE",
            url: "/delete",
            payload: { cpf, appointmentId },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ message: "Appointment deleted successfully" });
        expect(repository.deleteByIdAndCpf).toHaveBeenCalledWith(appointmentId, cpf);
    });

    it("requires an appointment ID", async () => {
        const response = await app.inject({
            method: "DELETE",
            url: "/delete",
            payload: { cpf },
        });
        expect(response.statusCode).toBe(400);
        expect(repository.deleteByIdAndCpf).not.toHaveBeenCalled();
    });
});
