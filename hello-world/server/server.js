const { ApolloServer, gql } = require('apollo-server'); //to parse the schema. gql is a tag function

const typeDefs = gql`
    type Query {
        greeting: String
    }
`;

const resolvers = { // object literal
    Query: {
        greeting: () => 'Hello GraphQL world!' // this function resolves the value of the greetings field
    }
}

// define our server - import from the apollo server class
const server = new ApolloServer({typeDefs, resolvers});
server.listen({port: 9000})
    .then(({url}) => console.log(`Server running at ${url}`))