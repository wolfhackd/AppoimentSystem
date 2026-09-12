export class Validator {
    static required(value: unknown, field: string) {
        if (value === undefined || value === null || value === "") {
            throw new Error(`${field} is required`);
        }
    }

    static isNumber(value: unknown, field: string) {
        if (typeof value !== "number") {
            throw new Error(`${field} must be a number`);
        }
    }

    static isString(value: unknown, field: string) {
        if (typeof value !== "string") {
            throw new Error(`${field} must be a string`);
        }
    }

    static isEmail(value: unknown, field: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value as string)) {
            throw new Error(`${field} must be a valid email`);
        }
    }

    static isCpf(value: unknown, field: string) {
        const cpfRegex = /^\d{11}$/;
        if (!cpfRegex.test(value as string)) {
            throw new Error(`${field} must be a valid CPF`);
        }
    }

}