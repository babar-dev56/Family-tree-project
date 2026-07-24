const knex = require("knex");

const config = require("../knexFile.js");

const db = knex(config.development);

module.exports = db;