const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
// take callback based functions and turns them into promise based functions
const { promisify } = require("util");

const { transport, makeANiceEmail } = require("../mail");

const MAX_AGE = 1000 * 60 * 60 * 24 * 365;

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
      maxAge: MAX_AGE
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
      maxAge: MAX_AGE
    });
    // 5. Return the user
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },
  async requestReset(parent, args, ctx, info) {
    //  1 - check if a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2 - set a reset token and expiry on the user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; //1hr from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });

    // 3 - Email them that reset token
    try {
      const mailRes = await transport.sendMail({
        from: "denis.molloy@gmail.com",
        to: user.email,
        subject: "Your password reset token",
        html: makeANiceEmail(
          `Your password reset token is here!!\n\n<a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here To Reset</a>`
        )
      });
    } catch (e) {
      console.log("Reset email failed to send: ", e);
    }

    // 4 - Return the message
    return { message: "Thanks!" };
  },

  async resetPassword(parent, args, ctx, info) {
    // 1 - check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Your passwords don't match.");
    }
    // 2 - check if its a legit reset token
    // 3 - check if its expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        // this ensures that the presented token is less than an hour old
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });

    if (!user) {
      throw new Error("This token is either invalid or expired");
    }
    // 4 - hash their new passwrod
    const password = await bcrypt.hash(args.password, 10);

    // 5- Save the new password to the user and remove old resetToken
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    // 6 - Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7 - Set the JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: MAX_AGE
    });
    // 8 - return the new user
    return updatedUser;
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
