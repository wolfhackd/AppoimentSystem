

export interface CreateServiceInputDTO {
    name: string;
    description: string;
    price: number;
    duration: number;
    establishId: string;
}

export interface CreateServiceDTO {
    name: string;
    description: string;
    price: number;
    duration: number;
    establishId: string;
    ownerId: string;
}