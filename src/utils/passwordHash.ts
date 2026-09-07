import { hash, compare } from "bcrypt-ts";




export class PasswordHash {
    constructor(private saltRounds: number = 10) {}

    static async hashPassword(password: string): Promise<string> {
        const passwordHash = hash(password, 10);
        return passwordHash;
    }

    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await compare(password, hashedPassword);
        return isMatch;
    }
}