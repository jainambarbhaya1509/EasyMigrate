  // Loop for creating table schema
//   for (let i = 0; i < tableNames.length; i++) {
//     const tableName = tableNames[i];
//     const tableCols = rows[i].map((columnName) => `${columnName} text`).join(", "); // Replace text with function which will determine the datatype of column
//     await createTable(tableName, tableCols);
//   }

//   // Loop for inserting data to the table
//   for (let i = 0; i < tableNames.length; i++) {
//     const tableName = tableNames[i];
//     const tableCols = rows[i].map((columnName) => `${columnName}`).join(", ");
//     const worksheet = workbook.Sheets[tableName];
//     const tableData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
//     tableData.shift();
//     await insertData(tableName, tableCols, tableData);
//     console.log(tableData.length, " Records Inserted in ", tableName);
//   }
// }