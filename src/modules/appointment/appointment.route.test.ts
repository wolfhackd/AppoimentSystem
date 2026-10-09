import cookie from "@fastify/cookie";
import { serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import fastify, { type FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appointmentRoute } from "./appointment.route";

const repository = vi.hoisted(() => ({
    create: vi.fn(),
    deleteByIdAndCpf: vi.fn(),
}));

vi.mock("./appointment.repository", () => ({
    AppointmentRepository: class {
        create = repository.create;
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
        expect(repository.deleteByIdAndCpf).not.toHaveBeenCalled();
    });
});
