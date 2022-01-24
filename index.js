// Create a constant variable, PORT, based on what's in process.env.PORT or fallback to 3000
const express = require("express");
const server = express();
const PORT = 3000;
const morgan = require("morgan");
const cors = require("cors");

server.use(morgan("dev"));
server.use(cors());
server.use(express.json());

const apiRouter = require("./api");
server.use("/api", apiRouter);

const { client } = require("/db");

server.use("*", (_, res, next) => {
  try {
    res.send(`<h1>404 Not Found</h1>`);
  } catch (err) {
    next(err);
  }
});

server.use((err, req, res, next) => {
  err.status = 500;
  next(err);
});

const handle = server.listen(PORT, async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error(err);
    await client.end();
    throw err;
  }
});

module.exports = { handle };
