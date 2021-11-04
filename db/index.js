const { Pool } = require("pg");
const { user, password, sqlPort, sqlHost, database } = require("../config");

const pool = new Pool({
  user: user,
  password: password,
  port: sqlPort,
  host: sqlHost,
  database: database,
});

module.exports = pool;
