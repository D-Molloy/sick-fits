const mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if the user is logged in
    // Our API for the prisma db is defined in prisma.graphql under `type Mutations`
    // ctx has a db property due to our exposing of the db to the context in createServer.js
    // info param contains the query
    // ctx.db.mutation.createItem returns a Promise, so we have to make it async to save the actual value into the item
    // alternative would be to just return the item: `return ctx.db.mutation.createItem`, but the below syntax is better for debugging
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // we could manually place everything from the args in this object (name, image, etc)
          ...args
        }
      },
      info
    );
    // console.log(item)
    return item;
  },
  updateItem(parent, args, ctx, info) {
    // ctx - content in the request
    // db - get access to the Prisma db
    // query/mutation - accss to all of the queries in the generated\prisma.graphql (our api)

    // first take a copy of the updates
    const updates = { ...args };
    // remove the ID from the updates - we can't update the id so we want to remove it from the updates
    delete updates.id;
    // run update method
    // updateItem(data: ItemUpdateInput!, where: ItemWhereUniqueInput!): Item
    // data - the update data
    // where - which item to update
    // info - contains the query from the client side and tells it what to return
    return ctx.db.mutation.updateItem(
      { data: updates, where: { id: args.id } },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1 - find the item
    const item = await ctx.db.query.item({ where }, `{id, title}`);
    // 2 - Check if they own that item, or have permissions
    // TODO:
    // 3 - delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  }
};
// createDog(parent, args, ctx, info) {
//   global.dogs = global.dogs || [];
//   // create a dog
//   const newDog = { name: args.name };
//   global.dogs.push(newDog);
//   return newDog;
// }

module.exports = mutations;
