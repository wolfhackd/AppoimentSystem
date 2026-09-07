

export interface CreateOwnerDTO {
    email: string;
    cpf: string;
    name: string;
    phone: string;
    password: string;
}

export interface LoginOwnerDTO {
    emailOrCpf?: string;
    password: string;
}