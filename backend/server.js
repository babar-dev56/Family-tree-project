require("dotenv").config();

const express = require("express");
const { Model } = require("objection");
const db = require("./db");
const memberRoutes = require("./routes/memberRoutes");
const cors = require("cors");

Model.knex(db);

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to Family Tree API");
});

app.use("/members", memberRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});