import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import type { ServiceRepository } from "./service.repository";
import { ServiceService } from "./service.service";

describe("ServiceService", () => {
    let service: ServiceService;
    let repository: Mocked<ServiceRepository>;

    const serviceId = "service-id";
    const establishmentId = "establishment-id";
    const ownerId = "owner-id";
    const existingService = { id: serviceId, establishmentId };

    beforeEach(() => {
        repository = {
            getEstablishmentByIdAndOwner: vi.fn().mockResolvedValue({ id: establishmentId }),
            createService: vi.fn().mockResolvedValue({ id: serviceId }),
            getServiceById: vi.fn().mockResolvedValue(existingService),
            updateService: vi.fn().mockResolvedValue({ ...existingService, name: "Updated service" }),
            deleteService: vi.fn().mockResolvedValue({ id: serviceId }),
        } as unknown as Mocked<ServiceRepository>;
        service = new ServiceService(repository);
    });

    describe("createService", () => {
        const input = {
            name: "Consultation",
            description: "Initial consultation",
            price: 100,
            duration: 60,
            establishId: establishmentId,
            ownerId,
        };

        it("creates a service after verifying establishment ownership", async () => {
            await service.createService(input);

            expect(repository.getEstablishmentByIdAndOwner).toHaveBeenCalledWith(
                establishmentId,
                ownerId,
            );
            expect(repository.createService).toHaveBeenCalledWith(input);
        });

        it("rejects creation when the establishment does not belong to the owner", async () => {
            repository.getEstablishmentByIdAndOwner.mockResolvedValue(null);

            await expect(service.createService(input)).rejects.toThrow(
                "Establishment not found or you are not the owner",
            );
            expect(repository.createService).not.toHaveBeenCalled();
        });
    });

    describe("getServiceById", () => {
        it("returns the service from the repository", async () => {
            await expect(service.getServiceById(serviceId)).resolves.toBe(existingService);
            expect(repository.getServiceById).toHaveBeenCalledWith(serviceId);
        });

        it("returns null when the service does not exist", async () => {
            repository.getServiceById.mockResolvedValue(null);

            await expect(service.getServiceById(serviceId)).resolves.toBeNull();
        });
    });

    describe("updateService", () => {
        const input = {
            serviceId,
            ownerId,
            name: "Updated service",
            description: null,
        };

        it("updates only provided fields after verifying ownership", async () => {
            await service.updateService(input);

            expect(repository.getServiceById).toHaveBeenCalledWith(serviceId);
            expect(repository.getEstablishmentByIdAndOwner).toHaveBeenCalledWith(
                establishmentId,
                ownerId,
            );
            expect(repository.updateService).toHaveBeenCalledWith(serviceId, {
                name: "Updated service",
                description: null,
            });
        });

        it("rejects updates when the service does not exist", async () => {
            repository.getServiceById.mockResolvedValue(null);

            await expect(service.updateService(input)).rejects.toThrow("Service not found!");
            expect(repository.getEstablishmentByIdAndOwner).not.toHaveBeenCalled();
            expect(repository.updateService).not.toHaveBeenCalled();
        });

        it("rejects updates when the user does not own the establishment", async () => {
            repository.getEstablishmentByIdAndOwner.mockResolvedValue(null);

            await expect(service.updateService(input)).rejects.toThrow(
                "User is not the owner of the establishment!",
            );
            expect(repository.updateService).not.toHaveBeenCalled();
        });
    });

    describe("deleteService", () => {
        const input = { serviceId, ownerId };

        it("deletes the service after verifying its owner", async () => {
            await service.deleteService(input);

            expect(repository.getEstablishmentByIdAndOwner).toHaveBeenCalledWith(
                establishmentId,
                ownerId,
            );
            expect(repository.deleteService).toHaveBeenCalledWith(serviceId);
        });

        it("rejects deletion when the service does not exist", async () => {
            repository.getServiceById.mockResolvedValue(null);

            await expect(service.deleteService(input)).rejects.toThrow("Service not found!");
            expect(repository.deleteService).not.toHaveBeenCalled();
        });

        it("rejects deletion when the user does not own the establishment", async () => {
            repository.getEstablishmentByIdAndOwner.mockResolvedValue(null);

            await expect(service.deleteService(input)).rejects.toThrow(
                "User is not the owner of the establishment!",
            );
            expect(repository.deleteService).not.toHaveBeenCalled();
        });
    });
});
