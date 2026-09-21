import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateOwnerDTO, LoginOwnerDTO } from "./owner.types";
import type { OwnerService } from "./owner.service";
import { TokenService } from "../../utils/tokenService";
import { CookieService } from "../../utils/cookieService";




export class OwnerController {
    constructor(private service: OwnerService){}
    async createOwner(request: FastifyRequest, reply: FastifyReply){
        try{

            const data = request.body as CreateOwnerDTO;
            
            await this.service.createOwner(data);
            
            return reply.status(201).send({message: "Owner created successfully!"})   
        } catch (error: any) {
            return reply.status(400).send({message: "Error creating owner!", error: error.message})
        }
    }

    async login(request: FastifyRequest, reply: FastifyReply){

        try{
            const data = request.body as LoginOwnerDTO;
            
           
            if(data.emailOrCpf?.includes("@")){
                const owner = await this.service.loginWithEmail(data);
                const token = TokenService.generateToken(owner);
                CookieService.setCookie(reply,token);
                return reply.status(200).send({message: "Login successful!"});
            }else{
                const owner = await this.service.loginWithCpf(data);
                const token = TokenService.generateToken(owner);
                CookieService.setCookie(reply,token);
                return reply.status(200).send({message: "Login successful!"});
            }

        }catch (error: any) {
            return reply.status(400).send({message: "Error logging in!", error: error.message})
        }
    }
}