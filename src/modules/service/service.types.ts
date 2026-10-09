import z from "zod";

export const CreateServiceInputSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(1, "Price must be greater than 0"),
    duration: z.number().min(1, "Duration must be greater than 0"),
    establishId: z.uuid('Establishment id must be a valid uuid'),
})

export type CreateServiceInputDTO = z.infer<typeof CreateServiceInputSchema>

export const CreateServiceInputWithOwnerIdSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(1, "Price must be greater than 0"),
    duration: z.number().min(1, "Duration must be greater than 0"),
    establishId: z.uuid('Establishment id must be a valid uuid'),
    ownerId: z.uuid("Owner id is required"),
})

export type CreateServiceInputWithOwnerIdDTO = z.infer<typeof CreateServiceInputWithOwnerIdSchema>

const UpdateServiceFieldsSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().min(1, "Description is required").nullable().optional(),
    price: z.number().min(1, "Price must be greater than 0").optional(),
    duration: z.number().int().min(1, "Duration must be greater than 0").optional(),
})

const hasServiceUpdates = (data: {
    name?: string | undefined;
    description?: string | null | undefined;
    price?: number | undefined;
    duration?: number | undefined;
}) => [data.name, data.description, data.price, data.duration].some((value) => value !== undefined)

export const UpdateServiceSchema = z.object({
    serviceId: z.uuid("Service id is required"),
    ...UpdateServiceFieldsSchema.shape,
}).refine((data) => hasServiceUpdates(data), {
    message: "At least one field must be provided to update the service.",
    path: ["name"],
})

export type UpdateServiceInputDTO = z.infer<typeof UpdateServiceSchema>

export const UpdateServiceWithOwnerIdSchema = z.object({
    serviceId: z.uuid("Service id is required"),
    ...UpdateServiceFieldsSchema.shape,
    ownerId: z.uuid("Owner id is required"),
}).refine((data) => hasServiceUpdates(data), {
    message: "At least one field must be provided to update the service.",
    path: ["name"],
})

export type UpdateServiceWithOwnerIdDTO = z.infer<typeof UpdateServiceWithOwnerIdSchema>

export const DeleteServiceSchema = z.object({
    serviceId: z.uuid("Service id is required"),
})

export type DeleteServiceInputDTO = z.infer<typeof DeleteServiceSchema>

export const DeleteServiceWithOwnerIdSchema = DeleteServiceSchema.extend({
    ownerId: z.uuid("Owner id is required"),
})

export type DeleteServiceWithOwnerIdDTO = z.infer<typeof DeleteServiceWithOwnerIdSchema>
