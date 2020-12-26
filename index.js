const { ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch');

const port = 4000;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
    type Astronaut {
        id: ID!
        name: String
    }

    type Mission {
        id: ID!
        designation: String
        crew: [ Astronaut ]
        startDate: String,
        EndDate: String
    }

    type Query{
        astronaut(id: ID!): Astronaut
        astronauts:[Astronaut]
        mission(id:ID!): Mission
        missions: [Mission]
    }
`

const resolvers = {
    Query: {
        astronaut: (_, { id }) => {
            return fetch(`${apiUrl}/astronauts/${id}`).then(res => res.json());
        },
        astronauts: () => {
            return fetch(`${apiUrl}/astronauts`).then(res => res.json());
        },
        mission: (_, { id }) => {
            return fetch(`${apiUrl}/missions/${id}`).then(res => res.json());
        },
        missions: () => {
            return fetch(`${apiUrl}/missions/`).then(res => res.json());
        }
    },
    Mission: {
        crew({ crew }) {
            return crew.map(id => ({ __typename: "Astronaut", id }))
        }
    },
    Astronaut: {
        id: ({ id }) => id,
        name: ({ id }) => fetch(`${apiUrl}/astronauts/${id}`).then(res => res.json()).then(json => { console.log(json); return json.name })
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen({ port }).then(({ url }) => {
    console.log(`server ready at ${url}`)
})