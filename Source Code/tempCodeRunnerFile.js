const { Client } = require('pg');
const XLSX = require('xlsx');

// Define PostgreSQL connection details
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'test',
  password: 'admin',
  port: 5432, // Change to the appropriate port if necessary
};

// Define the path to the Excel file
const excelFilePath = 'C:/Users/Jainam Barbhaya/Desktop/Migration Package/Files/student.xlsx';

// Define the name of the Excel sheet to be migrated
const sheetName = 'student_data'; // Change to the appropriate sheet name

async function migrateExcelDataToPostgres() {
  // Connect to the PostgreSQL database
  const client = new Client(dbConfig);
  await client.connect();

  try {
    // Read the Excel file
    const workbook = XLSX.readFile(excelFilePath);
    
    // Get the desired sheet from the workbook
    const sheet = workbook.Sheets[sheetName];
    
    // Convert the sheet data to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    
    // Extract column names from the first row
    const columnNames = jsonData[0];
    
    // Infer data types for each column
    const columnTypes = [];
    for (let colIndex = 0; colIndex < columnNames.length; colIndex++) {
      let dataType = 'text'; // Default data type is text
      
      for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
        const cellValue = jsonData[rowIndex][colIndex];
        
        if (typeof cellValue === 'number' && Number.isInteger(cellValue)) {
          dataType = 'integer';
        } else if (typeof cellValue === 'number' && !Number.isInteger(cellValue)) {
          dataType = 'numeric';
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(cellValue)) {
          dataType = 'date';
        }
      }
      
      columnTypes.push(dataType);
    }
    
    // Create the table in the PostgreSQL database
    await client.query(`CREATE TABLE IF NOT EXISTS migrated_data (${columnNames.map((name, index) => `"${name}" ${columnTypes[index]}`).join(', ')})`);
    
    // Prepare the INSERT statement
    const insertStatement = `INSERT INTO migrated_data VALUES (${columnNames.map((_, index) => `$${index + 1}`).join(', ')}) ON CONFLICT DO NOTHING`;
    
    // Insert data into the PostgreSQL table
    for (let i = 1; i < jsonData.length; i++) {
      const values = jsonData[i];
      await client.query(insertStatement, values);
    }
    
    console.log('Data migration completed successfully.');
  } catch (error) {
    console.error('Error occurred during data migration:', error);
  } finally {
    // Close the database connection
    await client.end();
  }
}

migrateExcelDataToPostgres();
