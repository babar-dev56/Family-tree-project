const express = require("express");
const { Model } = require("objection");
const db = require("./db");
const memberRoutes = require("./routes/memberRoutes");
const cors = require("cors");

Model.knex(db);

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], 
}));

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Welcome to Family Tree API");
});

app.use("/members", memberRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});