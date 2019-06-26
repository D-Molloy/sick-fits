/**
 * - Start up the node server
 */
require("dotenv").config({ path: "variables.env" });

const createServer = require("./createServer");
const db = require("./db");
const server = createServer();

// TODO: use express middleware to handle cookies (JWT)
// TODO: Use express middleware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origins: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is running on http://localhost:${deets.port}`);
  }
);
