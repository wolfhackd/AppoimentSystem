import { PasswordHash } from "../../utils/passwordHash";
import type { OwnerRepository } from "./owner.repository";
import type { CreateOwnerDTO, LoginOwnerDTO } from "./owner.types";
import {} from "bcrypt-ts";



export class OwnerService {
    constructor(private repository: OwnerRepository){}

    async createOwner(data: CreateOwnerDTO){

        const cpfExists = await this.repository.getOwnerByCpf(data.cpf);
        if(cpfExists){
            throw new Error("CPF already exists");
        }

        const emailExists = await this.repository.getOwnerByEmail(data.email);
        if(emailExists){
            throw new Error("Email already exists");
        }

        data.password = await PasswordHash.hashPassword(data.password);

        return this.repository.createOwner(data);
    }

    async loginWithCpf(data: LoginOwnerDTO){
        const owner = await this.repository.getOwnerByCpf(data.emailOrCpf as string);
        if(!owner){
            throw new Error("Owner not found");
        }
        const passwordValid = await PasswordHash.comparePassword(data.password, owner.password);
        if(!passwordValid){
            throw new Error("Password is invalid");
        }
        return owner;
    }

    async loginWithEmail(data: LoginOwnerDTO){
        const owner = await this.repository.getOwnerByEmail(data.emailOrCpf as string);
        if(!owner){
            throw new Error("Owner not found");
        }
        const passwordValid = await PasswordHash.comparePassword(data.password, owner.password);
        if(!passwordValid){
            throw new Error("Password is invalid");
        }
        return owner;
    }

}