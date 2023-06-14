const xlsx = require("xlsx");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// PostgreSQL Server Information
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test",
  password: "admin",
  port: 5432
});

// Connect to PostgreSQL Database
async function connectToPostgreSQL() {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  }
}

// Disconnect from PostgreSQL Database
async function disconnectFromPostgreSQL() {
  try {
    pool.end();
    console.log('Disconnected from PostgreSQL');
  } catch (error) {
    console.error('Error disconnecting from PostgreSQL:', error);
  }
}

// Read data from excel file
async function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  // Get the lowercase and underscored version of the file name
  const tableName = path.basename(filePath).toLowerCase().replace(/\s/g, '_').replace(path.extname(path.basename(filePath)), "");
  console.log("Table Name: ", tableName);

  let rows = [];

  for (const sheetName of sheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const range = xlsx.utils.decode_range(worksheet['!ref']);

    let row = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = xlsx.utils.encode_cell({ r: range.s.r, c });
      const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : '';
      const column = cellValue.toLowerCase().replace(/\s/g, "_");
      row.push(column);
    }

    // Pushing columns name of each sheet into rows list for mapping
    rows.push(row);
    
    console.log(`Sheet: ${sheetName}`);
    console.log(row);

    // Emptying the row list for new sheet
    row = [];
  }
  console.log(rows);

  
}

async function createTable(tableName, tableRows) {
  try {
    const client = await pool.connect();
    const query = `CREATE TABLE IF NOT EXISTS public.${tableName}(${tableRows})`;

    await client.query(query);
    console.log(`Table ${tableName} created in the database`);
    client.release();
  } catch (error) {
    console.error('Error creating table:', error);
  }
}


// Main function
async function main() {
  await connectToPostgreSQL();
  await readExcel("C:/Users/Jainam Barbhaya/Desktop/Migration Package/Files/student data.xlsx");
  await disconnectFromPostgreSQL();
}

// Call the main function
main();
