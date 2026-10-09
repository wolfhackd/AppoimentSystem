import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import type { ServiceRepository } from "./service.repository";
import { ServiceService } from "./service.service";

describe("ServiceService.deleteService", () => {
    let service: ServiceService;
    let repository: Mocked<ServiceRepository>;

    const input = {
        serviceId: "service-id",
        ownerId: "owner-id",
    };

    beforeEach(() => {
        repository = {
            getServiceById: vi.fn().mockResolvedValue({
                id: input.serviceId,
                establishmentId: "establishment-id",
            }),
            getEstablishmentByIdAndOwner: vi.fn().mockResolvedValue({ id: "establishment-id" }),
            deleteService: vi.fn().mockResolvedValue({ id: input.serviceId }),
        } as unknown as Mocked<ServiceRepository>;
        service = new ServiceService(repository);
    });

    it("deletes the service after verifying its owner", async () => {
        await service.deleteService(input);

        expect(repository.getEstablishmentByIdAndOwner).toHaveBeenCalledWith(
            "establishment-id",
            input.ownerId,
        );
        expect(repository.deleteService).toHaveBeenCalledWith(input.serviceId);
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
