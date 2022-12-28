const app = require("./app");
const dontenv = require("dotenv");
const connectDatabase = require("./config/database");

// Unhandled exceptions Error

process.on("uncaughtException", (err) => {
    console.log(err.message);
console.log(`Shutting down the server due to Unhandled exceptions Error`);
    process.exit(1);
})

// config
dontenv.config({ path: "config/.env" });
connectDatabase();

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

// Unhandle Server Rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
