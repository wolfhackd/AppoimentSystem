export class Validator {
    static required(value: unknown, field: string) {
        if (value === undefined || value === null || value === "") {
            throw new Error(`${field} é obrigatório`);
        }
    }

    static isNumber(value: unknown, field: string) {
        if (typeof value !== "number") {
            throw new Error(`${field} deve ser um número`);
        }
    }

    static isString(value: unknown, field: string) {
        if (typeof value !== "string") {
            throw new Error(`${field} deve ser uma string`);
        }
    }

    static isEmail(value: unknown, field: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value as string)) {
            throw new Error(`${field} deve ser um email válido`);
        }
    }

    static isCpf(value: unknown, field: string) {
        const cpfRegex = /^\d{11}$/;
        if (!cpfRegex.test(value as string)) {
            throw new Error(`${field} deve ser um CPF válido`);
        }
    }

}