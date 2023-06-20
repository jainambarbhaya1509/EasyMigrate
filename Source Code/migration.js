const xlsx = require("xlsx");
const { Pool } = require("pg");
const fs = require("fs");
const prompt = require('prompt-sync')();

// PostgreSQL Server Information
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test",
  password: "admin",
  port: 5432,
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
  const tableNames = workbook.SheetNames;
  console.log("Table Names: ", tableNames)

  let rows = [];

  // Retrieving column names form 
  for (const tableName of tableNames) {
    const worksheet = workbook.Sheets[tableName];
    const range = xlsx.utils.decode_range(worksheet['!ref']);

    let row = []; //Emptying list for new sheet

    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = xlsx.utils.encode_cell({ r: range.s.r, c });
      const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : '';
      const column = cellValue.toLowerCase().replace(/\s/g, "_");
      row.push(column);
    }

    // Adding columns name of each sheet into rows list for mapping
    rows.push(row);

    console.log(`Table: ${tableName}`);
    console.log(row);
  }
  console.log(rows);

  // Asking user for datatype
  let dts = [];
  for (let i = 0; i < tableNames.length; i++) {
    let dt = []
    const tableName = tableNames[i];
    const tableCols = rows[i].map((columnName) => `${columnName}`);
    console.log("Enter Datatype & Constraints of: ", tableName)
    for (let col of tableCols) {
      col = prompt(`${col}: `)
      dt.push(col || 'text');
    }
    dts.push(dt)
    console.log(dt)
  }

  // Loop for creating table schema
  for (let i = 0; i < tableNames.length; i++) {
    const tableName = tableNames[i];
    const tableCols = rows[i].map((columnName, index) => `${columnName} ${dts[i][index]}`).join(", ");
    await createTable(tableName, tableCols);
  }

  // Loop for inserting data to the table
  for (let i = 0; i < tableNames.length; i++) {
    const tableName = tableNames[i];
    const tableCols = rows[i].map((columnName) => `${columnName}`).join(", ");
    const worksheet = workbook.Sheets[tableName];
    const tableData = xlsx.utils.sheet_to_json(worksheet, {header: 1, raw: false, dateNF: 'yyyy-mm-dd'});
    tableData.shift();
    await insertData(tableName, tableCols, tableData);
    console.log(tableData.length, " Records Inserted in ", tableName);
  }  
}

// Create table query for sheets in excel file
async function createTable(tableName, tableCols) {
  try {
    const client = await pool.connect();
    const query = `CREATE TABLE IF NOT EXISTS public.${tableName} ( ${tableCols} );`;
    console.log(query);
    await client.query(query);
    console.log(`Table ${tableName} created in the database`);
    client.release();
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Query to insert data into the table
async function insertData(tableName, tableCols, records) {
  try {
    const client = await pool.connect();
    const values = records.map((record) => {
      const sanitizedRecord = record.map((row) => {
        // Check if cell value is empty and assign a default value
        if (row === "") {
          return "null";
        } else {
          return `'${row}'`;
        }
      });
      return `(${sanitizedRecord.join(", ")})`;
    }).join(", ");
    const query = `INSERT INTO ${tableName} (${tableCols}) VALUES ${values};`;
    console.log(query);
    await client.query(query);
    client.release();
  } catch (error) {
    console.error("Error inserting data: ", error);
  }
}


// Main function
async function main() {
  await connectToPostgreSQL();
  await readExcel("C:/Users/Jainam Barbhaya/Desktop/employee.xlsx");
  await disconnectFromPostgreSQL();
}

// Call the main function
main();