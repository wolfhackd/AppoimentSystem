import cookie from "@fastify/cookie";
import { serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import fastify, { type FastifyInstance } from "fastify";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { TokenService } from "../../utils/tokenService";
import { serviceRouter } from "./service.route";

const repository = vi.hoisted(() => ({
    getEstablishmentByIdAndOwner: vi.fn(),
    createService: vi.fn(),
    getServiceById: vi.fn(),
    updateService: vi.fn(),
    deleteService: vi.fn(),
}));

vi.mock("./service.repository", () => ({
    ServiceRepository: class {
        getEstablishmentByIdAndOwner = repository.getEstablishmentByIdAndOwner;
        createService = repository.createService;
        getServiceById = repository.getServiceById;
        updateService = repository.updateService;
        deleteService = repository.deleteService;
    },
}));

const ownerId = "00000000-0000-4000-8000-000000000001";
const establishmentId = "00000000-0000-4000-8000-000000000002";
const serviceId = "00000000-0000-4000-8000-000000000003";
const createBody = {
    name: "Consulta",
    description: "Consulta inicial",
    price: 100,
    duration: 60,
    establishId: establishmentId,
};

describe("service routes", () => {
    let app: FastifyInstance;
    const originalJwtSecret = process.env.JWT_SECRET;

    beforeAll(() => {
        process.env.JWT_SECRET = "service-route-test-secret";
    });

    afterAll(() => {
        if (originalJwtSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = originalJwtSecret;
        }
    });

    beforeEach(() => {
        vi.resetAllMocks();
        repository.getEstablishmentByIdAndOwner.mockResolvedValue({ id: establishmentId });
        repository.getServiceById.mockResolvedValue({
            id: serviceId,
            establishmentId,
        });

        app = fastify();
        app.register(cookie);
        app.setValidatorCompiler(validatorCompiler);
        app.setSerializerCompiler(serializerCompiler);
        serviceRouter(app);
    });

    afterEach(async () => {
        await app.close();
    });

    function authCookie() {
        return `token=${TokenService.generateToken({ id: ownerId })}`;
    }

    it("creates a service and uses the authenticated owner", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/create",
            headers: { cookie: authCookie() },
            payload: createBody,
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({ message: "Service created successfully" });
        expect(repository.getEstablishmentByIdAndOwner).toHaveBeenCalledWith(
            establishmentId,
            ownerId,
        );
        expect(repository.createService).toHaveBeenCalledWith({ ...createBody, ownerId });
    });

    it("updates a service and returns the updated record", async () => {
        const updatedService = { id: serviceId, name: "Consulta atualizada", price: 120 };
        repository.updateService.mockResolvedValue(updatedService);

        const response = await app.inject({
            method: "PATCH",
            url: "/edit",
            headers: { cookie: authCookie() },
            payload: { serviceId, name: updatedService.name, price: updatedService.price },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            message: "Service updated successfully",
            service: updatedService,
        });
        expect(repository.getEstablishmentByIdAndOwner).toHaveBeenCalledWith(
            establishmentId,
            ownerId,
        );
        expect(repository.updateService).toHaveBeenCalledWith(serviceId, {
            name: updatedService.name,
            price: updatedService.price,
        });
    });

    it("deletes a service after checking ownership", async () => {
        repository.deleteService.mockResolvedValue({ id: serviceId });

        const response = await app.inject({
            method: "DELETE",
            url: "/delete",
            headers: { cookie: authCookie() },
            payload: { serviceId },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ message: "Service deleted successfully" });
        expect(repository.getEstablishmentByIdAndOwner).toHaveBeenCalledWith(
            establishmentId,
            ownerId,
        );
        expect(repository.deleteService).toHaveBeenCalledWith(serviceId);
    });

    it("requires authentication for each service route", async () => {
        const requests = [
            { method: "POST" as const, url: "/create", payload: createBody },
            { method: "PATCH" as const, url: "/edit", payload: { serviceId, name: "Novo nome" } },
            { method: "DELETE" as const, url: "/delete", payload: { serviceId } },
        ];

        for (const request of requests) {
            const response = await app.inject(request);

            expect(response.statusCode).toBe(401);
            expect(response.json()).toEqual({ message: "User not logged" });
        }

        expect(repository.createService).not.toHaveBeenCalled();
        expect(repository.updateService).not.toHaveBeenCalled();
        expect(repository.deleteService).not.toHaveBeenCalled();
    });

    it("rejects invalid request data before calling the service", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/create",
            headers: { cookie: authCookie() },
            payload: { ...createBody, price: 0 },
        });

        expect(response.statusCode).toBe(400);
        expect(repository.getEstablishmentByIdAndOwner).not.toHaveBeenCalled();
        expect(repository.createService).not.toHaveBeenCalled();
    });
});
