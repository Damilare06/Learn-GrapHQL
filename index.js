const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');
const { MONGODB } = require('./config.js');

const pubsub = new PubSub();

const server = new ApolloServer({ // our platform is the SM platform
  typeDefs,
  resolvers,
  context: ({req}) => ({req, pubsub})
});


// destructure the body, users login and get authentication token that should be passed to an authorization header to be sent to the request. 
//Get and decode the token, ensuring the user is authenticated
// this server-client authentication should only run on protected routes
mongoose
  .connect(MONGODB, { useNewUrlParser: true})
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: 5000 })
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch(err => {
    console.error(err)
  })
