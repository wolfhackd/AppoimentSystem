import {z} from 'zod';


export const CreateEstablishmentSchema = z.object({
    name: z.string("Name is required"),
    email: z.string("Email is required"),
    phone: z.string("Phone is required"),
})

export type CreateEstablishmentInputDTO = z.infer<typeof CreateEstablishmentSchema>;


export const CreateEstablishmentWithOwnerIdSchema = z.object({
    name: z.string("Name is required"),
    email: z.string("Email is required"),
    phone: z.string("Phone is required"),
    ownerId: z.uuid("Owner id is required"),
})

export type CreateEstablishmentWithOwnerIdInputDTO = z.infer<typeof CreateEstablishmentWithOwnerIdSchema>;

const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const RegisterBusinessHourSchema = z.object({
    establishmentId: z.uuid("Establishment id is required"),
    dayOfWeek: z.number("Day of week is required").min(1).max(7),
    openingTime: z.string().regex(timeRegex,"Opening time is required"),
    closingTime: z.string().regex(timeRegex,"Closing time is required"),
})

export type RegisterBusinessHourInputDTO = z.infer<typeof RegisterBusinessHourSchema>;

export const RegisterBusinessHourWithOwnerIdInputSchema = z.object({
    establishmentId: z.uuid('Establishment id is required'),
    dayOfWeek: z.number("Day of week is required"),
    openingTime: z.string().regex(timeRegex,"Opening time is required"),
    closingTime: z.string().regex(timeRegex,"Closing time is required"),
    ownerId: z.uuid("Owner id is required"),
})

export type RegisterBusinessHourWithOwnerIdInputDTO = z.infer<typeof RegisterBusinessHourWithOwnerIdInputSchema>;