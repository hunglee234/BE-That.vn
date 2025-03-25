require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes/index");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/", routes);

// Kết nối MongoDB
connectDB();

module.exports = app;
