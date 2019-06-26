// This file connects to the remote prisma db and gives up the ability to query it with JS
const { Prisma } = require("prisma-binding");
// we use the post deploy hook (in prisma.yml) to pull down prisma.graphql so that we can tell our yoga-graphql server how to query the db

const db = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  // debug: true will console.log all of the queries being made.  Great for debugging
  debug: false
});

module.exports = db;
