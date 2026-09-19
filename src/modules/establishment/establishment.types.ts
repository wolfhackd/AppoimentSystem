

export interface CreateEstablishmentInputDTO {
    name: string;
    email: string;
    phone: string;
}

export interface CreateEstablishmentDTO {
    name: string;
    email: string;
    phone: string;
    ownerId: string;
}

export interface RegisterBusinessHourInputDTO {
    establishmentId: string;
    dayOfWeek: number;
    openingTime: string;
    closingTime: string;
}

export interface RegisterBusinessHourDTO {
    establishmentId: string;
    dayOfWeek: number;
    openingTime: string;
    closingTime: string;
    ownerId: string;
}