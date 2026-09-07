import fastify from 'fastify';

const server = fastify();

//Routes imports
import { ownerRoute } from "./modules/owner/owner.route";

//Routes Registration
server.register(ownerRoute, { prefix: '/owner'});

server.listen({ port: 3000}, (err, address)=>{
    if (err) {
        server.log.error(err);
    }

    console.log(`Server listening at ${address} `)
})