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
  }
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || [];
  //   // create a dog
  //   const newDog = { name: args.name };
  //   global.dogs.push(newDog);
  //   return newDog;
  // }
};

module.exports = mutations;
