/**
 *  - TO ADD A NEW TYPE
 *    * add it to the data model (schema.graphql)
 *    * run `npm run deploy` to push the changes up to prisma
 *       * a new copy of prisma.graphql is brought down (all queries/mutations)
 *    * able to add mutations and queries
 *    * can write resolvers in Mutation.js and Query.js
 */

// all prisma-built crud apis are found in prisma.graphql => type Query

// if our query is the exact same as the query in prisma.graphql we can forward it to prisma directly
const { forwardTo } = require("prisma-binding");
const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current userId
    if (!ctx.request.userId) {
      //returning null to return nothing instead of throwing an error
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    ); //info is the query coming from the request (cart data)
  }
  // NOT USING FORWARDTO:
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
};

module.exports = Query;
