import type { FastifyReply } from 'fastify';


export class CookieService {


    static setCookie(reply:FastifyReply,token:string){
        reply.cookie("token",token,{
            httpOnly: true,
            // secure: process.env.TOKEN_SECRET;
            sameSite: "lax",
            path: "/"
        })
        
    }

    static clearToken(reply: FastifyReply) {
        reply.clearCookie("token", {
            path: "/",
        });
    }
}