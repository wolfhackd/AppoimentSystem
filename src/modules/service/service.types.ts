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
