require("dotenv").config();

const express = require("express");
const { Model } = require("objection");
const db = require("./db");
const memberRoutes = require("./routes/memberRoutes");
const cors = require("cors");

Model.knex(db);

const app = express();

const corsOptions = {
  origin: [
    "https://family-tree-project-tlxx.vercel.app",
    "http://localhost:3000",
    "http://localhost:5000",
    "https://family-tree-project-70d43.containers.snapdeploy.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to Family Tree API");
});

app.use("/members", memberRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});