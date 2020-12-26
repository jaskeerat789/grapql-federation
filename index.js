const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

const port = 4000;
const gateway = new ApolloGateway({
    serviceList: [
        { name: "Astronaut", url: "http://localhost:4001" }
    ]
})


const server = new ApolloServer({
    gateway,
    subscriptions:false
});

server.listen({ port }).then(({ url }) => {
    console.log(`Server is running at ${url}`)
})