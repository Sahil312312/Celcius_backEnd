const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: "./config.env" });
const connectDb = require("./config/connect")

const app = require("./app");



const port = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL
console.log(DATABASE_URL);
connectDb(DATABASE_URL)



const server = app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
