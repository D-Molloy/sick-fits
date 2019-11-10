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
const { hasPermission } = require("../utils");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }
    console.log(ctx.request.userId);
    // 2. Check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    // 2. if they do, query all the users!
    return ctx.db.query.users({}, info);
  }
};

module.exports = Query;
