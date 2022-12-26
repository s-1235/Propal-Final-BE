const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
// PORT
const PORT = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
const localDB = process.env.DATABASE;

mongoose
  .connect(DB, { dbName: "propal" })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.log(err);
  });

// Start Server
app.listen(PORT, (req, res) => {
  console.log(`Listening to port ${PORT}`);
});
