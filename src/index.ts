import fastify from 'fastify';
import cookie from '@fastify/cookie';


//Configuration
const server = fastify();
server.register(cookie);

//Routes imports
import { ownerRoute } from "./modules/owner/owner.route";
import { establishmentRoute } from "./modules/establishment/establishment.route"

//Routes Registration
server.register(ownerRoute, { prefix: '/owner'});
server.register(establishmentRoute, { prefix: '/establishment'});

server.listen({ port: 3000}, (err, address)=>{
    if (err) {
        server.log.error(err);
    }
    console.log(`Server listening at ${address} `)
})