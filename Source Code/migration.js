const xlsx = require("xlsx");
const { Pool } = require("pg");

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

  for (const tableName of tableNames) {
    const worksheet = workbook.Sheets[tableName];
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

    console.log(`Table: ${tableName}`);
    console.log(row);
  }
  console.log(rows);

  // Loop for creating table schema
  for (let i = 0; i < tableNames.length; i++) {
    const tableName = tableNames[i];
    const tableCols = rows[i].map((columnName) => `${columnName} text`).join(", ");
    await createTable(tableName, tableCols);
  }

  // // Loop for inserting data to the table
  // for (let i = 0; i < tableNames.length; i++) {
  //   const tableName = tableNames[i];
  //   const tableCols = rows[i].map((columnName) => `${columnName}`).join(", ");
  //   const worksheet = workbook.Sheets[tableName];
  //   const tableData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  //   console.log(1);
  //   tableData.shift();
  //   console.log(2)

  //   await insertData(tableName, tableCols, tableData);

  //   console.log(3)
  // }
}

// Create table query for sheets in excel file
async function createTable(tableName, tableCols) {
  try {
    const client = await pool.connect();
    const query = `CREATE TABLE IF NOT EXISTS public.${tableName} ( ${tableCols} );`;
    await client.query(query);
    console.log(tableName, " Create Table Query: ", query)
    console.log();
    console.log(`Table ${tableName} created in the database`);
    console.log("----------------------------")
    console.log();
    client.release();
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

async function insertData(tableName, tableCols, tableData) {
  try {
    console.log(4)
    const client = await pool.connect()
    console.log(5)
    const query = `INSERT INTO ${tableName} ( ${tableCols} ) VALUES ( ${tableData} );`;
    console.log(query)
    await client.query(query);
    console.log(7)
    console.log("Resord inserted in table ", tableName);
    console.log("----------------------------------------")
    console.log()
    client.release();
  } catch (error) {
    console.error("Error inserting data ", error);
  }
}


// Main function
async function main() {
  await connectToPostgreSQL();
  await readExcel("C:/Users/Jainam Barbhaya/Desktop/Migration Package/Files/student.xlsx");
  await disconnectFromPostgreSQL();
}

// Call the main function
main();