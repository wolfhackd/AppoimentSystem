import z from "zod";

export const CreateOwnerSchema = z.object({
    email: z.string().email().min(1).max(50),
    cpf: z.string().min(1).max(14),
    name: z.string().min(1).max(50),
    phone: z.string().min(1).max(15),
    password: z.string().min(1).max(50),
})

export type CreateOwnerDTO = z.infer<typeof CreateOwnerSchema>;

export const LoginOwnerSchema = z.object({
    emailOrCpf: z.string().min(1).max(50),
    password: z.string().min(1).max(50),
})

export type LoginOwnerDTO = z.infer<typeof LoginOwnerSchema>;
