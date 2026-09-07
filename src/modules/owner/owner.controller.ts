import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateOwnerDTO, LoginOwnerDTO } from "./owner.types";
import {Validator} from "../../utils/validator";
import type { OwnerService } from "./owner.service";
import { TokenService } from "../../utils/tokenService";




export class OwnerController {
    constructor(private service: OwnerService){}
    async createOwner(request: FastifyRequest, reply: FastifyReply){
        try{

            const data = request.body as CreateOwnerDTO;
            
            Validator.required(data.email, "email");
            Validator.required(data.cpf, "cpf");
            Validator.required(data.name, "name");
            Validator.required(data.phone, "phone");
            Validator.required(data.password, "password");
            
            Validator.isEmail(data.email, "email");
            Validator.isString(data.cpf, "cpf");
            Validator.isString(data.name, "name");
            Validator.isString(data.phone, "phone");
            Validator.isString(data.password, "password");
            await this.service.createOwner(data);
            
            return reply.status(201).send({message: "Owner created successfully!"})   
        } catch (error: any) {
            return reply.status(400).send({message: "Error creating owner!", error: error.message})
        }
    }

    async login(request: FastifyRequest, reply: FastifyReply){

        try{
            const data = request.body as LoginOwnerDTO;
            
            Validator.required(data.emailOrCpf, "emailOrCpf");
            Validator.required(data.password, "password");

            Validator.isString(data.emailOrCpf, "emailOrCpf");

            if(data.emailOrCpf?.includes("@")){
                Validator.isEmail(data.emailOrCpf, "emailOrCpf");
                const owner = await this.service.loginWithEmail(data);
                const token = TokenService.generateToken(owner);
                return reply.status(200).send({message: "Login successful!", token});
            }else{
                Validator.isCpf(data.emailOrCpf, "emailOrCpf");
                const owner = await this.service.loginWithCpf(data);
                const token = TokenService.generateToken(owner);
                return reply.status(200).send({message: "Login successful!", token});
            }

        }catch (error: any) {
            return reply.status(400).send({message: "Error logging in!", error: error.message})
        }
    }
}