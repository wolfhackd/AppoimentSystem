import fastify from 'fastify';

const server = fastify();

server.listen({ port: 3000}, (err, address)=>{
    if (err) {
        server.log.error(err);
    }

    console.log(`Server listening at ${address} `)
})