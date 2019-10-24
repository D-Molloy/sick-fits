/**
 * - Start up the node server
 */
require("dotenv").config({ path: "variables.env" });
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const createServer = require("./createServer");
const db = require("./db");
const server = createServer();

server.express.use(cookieParser());

// Decode the JWT so we can get the user ID on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    //put the userId on the req for future reqs to access
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is running on http://localhost:${deets.port}`);
  }
);
