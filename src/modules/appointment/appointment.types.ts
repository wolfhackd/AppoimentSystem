import {z} from 'zod';


const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const createAppointmentSchema = z.object({
    establishmentId: z.string().uuid("Establishment ID must be a valid UUID"),
    serviceId: z.string().uuid("Service ID must be a valid UUID"),
    hour: z.string().regex(timeRegex,"Invalid time format (expected HH:MM)"),
    name: z.string().min(3, "Name must be at least 3 characters long"),
    cpf: z.string().min(11, "Invalid CPF length").max(14),
    phone: z.string().min(10, "Invalid phone number"),
    email: z.string().email("Invalid email format"),
    dayOfWeek: z.number().int().min(1).max(7),
})

export type createAppointmentInput = z.infer<typeof createAppointmentSchema>;