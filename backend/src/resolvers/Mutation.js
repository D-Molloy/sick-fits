const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  },
  async signup(parent, args, ctx, info) {
    // lowercase the new email
    args.email = args.email.toLowerCase();
    // hash the password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    // create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the JWT as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      // cookie dies in a year
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // return the user to the browser
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password!");
    }
    // 3. generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 5. Return the user
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
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
