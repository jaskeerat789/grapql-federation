const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const fetch = require('node-fetch');

const port = 4002;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
    type Mission {
        id: ID!
        crew: [ Astronaut ]
        designation: String!
        startDate: String
        endDate: String
    }

    extend type Astronaut @key(fields: "id") {
        id: ID! @external
        missions: [ Mission ]
    }

    extend type Query {
        mission(id:ID!): Mission
        missions: [ Mission ]
    }
`

const resolvers = {
    Mission: {
        crew: (mission) => mission.crew.map(id => ({ __typename: "Astronaut", id }))
    },
    Astronaut: {
        missions: async (astronaut) => {
            const res = await fetch(`${apiUrl}/missions/${id}`);
            const missions = await res.json();

            return missions.filter(({ crew }) => crew.includes(parseInt(astronaut.id)))
        }
    },
    Query: {
        mission: (_,{ id }) => fetch(`${apiUrl}/missions/${id}`).then(res=> res.json()),
        missions: () => fetch(`${apiUrl}/missions`).then(res=> res.json())

    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => console.log(`Mission service is running at ${url}`))
