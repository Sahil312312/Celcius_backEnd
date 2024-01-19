const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: "./config.env" });


const app = require("./app");

const port = process.env.PORT || 8000;


const server = app.listen(port, () => {
  console.log(`app is running on ${port}`);
});