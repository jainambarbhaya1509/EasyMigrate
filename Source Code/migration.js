// Requiring Packages "xlsx" and "pg" from npm and inbuilt "fs" module

const xlsx = require("xlsx");
const { Pool } = require("pg");
const fs = require("fs");

// Connecting to the PostgreSQL Server

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "test",
    password: "admin",
    port: 5432
})

pool.query('SELECT * FROM student')
  .then((res) => {
    console.log('Result:', res.rows);
  })
  .catch((err) => {
    console.error('Error executing query', err);
  })
  .finally(() => {
    // Release the pool connection
    pool.end();
  });
