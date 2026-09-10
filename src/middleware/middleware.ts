import type { FastifyRequest } from "fastify";
import type { FastifyReply } from "fastify/types/reply";
import { TokenService } from "../utils/tokenService";

declare module "fastify" {
    interface FastifyRequest {
        user: any;
    }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply){
    const token = request.cookies.token;

    if(!token){
        return reply.status(401).send({message: 'User not logged'})
    }

    try{
        const payload = TokenService.verifyToken(token);
        request.user = payload;
    } catch(error){
         return reply.status(401).send({
            message: "Token invalid or expired"
        });
    }
}