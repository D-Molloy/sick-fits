// graphql sits on top of apollo/express server
const { GraphQLServer } = require("graphql-yoga");
// resolvers - where does the data come from or what does this data do?
// query resolvers - pulling data
// mutation resolvers = writing data

const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const db = require("./db");

/**
 * - Create GraphQL Yoga Server
 */

function createServer() {
  return new GraphQLServer({
    // this file can't be empty
    typeDefs: "src/schema.graphql",
    // properies in the resolver must be present in schema.graphql
    resolvers: {
      Mutation,
      Query
    },
    // turn off warnings
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    // accessing the db from the resolver (done via context)
    // exposing the db to every request
    context: req => ({ ...req, db })
  });
}

module.exports = createServer;
