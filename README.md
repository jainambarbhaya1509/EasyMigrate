# Excel to PostgreSQL Migration  
This Node.js script allows you to migrate data from an Excel file to a PostgreSQL database. It reads the data from the Excel file, creates tables based on the sheet names, prompts for column data types, and inserts the data into the respective tables in the PostgreSQL database.     

## Prerequisites   
Before running the script, make sure you have the following:
- Node.js installed on your machine.
- PostgreSQL database installed and running.
- Excel file containing the data you want to migrate.

## Installation   
1. Clone the repository or download the script to your local machine.
   ```
   https://github.com/jainambarbhaya1509/Migration-Package.git
   ```
 
3. Open a terminal and navigate to the project directory.
   
4. Install the required dependencies by running the following command:      
   ```
   npm install
   ```

## Usage   
1. Open the script file (`index.js`) in a text editor.

2. Update the PostgreSQL server information in the pool configuration object. Modify the `user`, `host`, `database`, `password`, and `port` according to your PostgreSQL setup.

3. Locate the line with the `readExcel()` function call. Update the file path to the Excel file you want to migrate:     
   `await readExcel("<path_to_excel_file>");`

4. Save the changes to the script file.

5. Open a terminal and navigate to the project directory.

6. Run the script using the following command:
   ```
   node migrate.js
   ```
   The script will connect to the PostgreSQL database, read the Excel file, create tables, prompt for column data types, and insert the data into the respective tables.

7. Follow the prompts to enter the data types for each column of the tables.

8. Once the migration process is complete, the script will disconnect from the PostgreSQL database.

## Contributing   
Contributions to this repository are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request. Your contributions can help make this script more robust and usable in various scenarios.

When contributing, please adhere to the following guidelines:

- Clearly describe the problem or feature you are addressing in your pull request or issue.
- Provide a detailed explanation of the changes you have made.
- Test your changes thoroughly to ensure they do not introduce any regressions.
- Follow the existing coding style and conventions used in the project.

Thank you for your interest in this repository. Your contributions are greatly appreciated!

## Note   
- Make sure the PostgreSQL server is running and accessible with the provided configuration.
  
- The script assumes that the Excel file contains multiple sheets, and each sheet represents a separate table in the database.
  
- The first row of each sheet is considered as the column names.
  
- The script will create tables in the public schema of the connected PostgreSQL database.
  
- The script assumes the column data types to be of text type by default. You can modify the script to handle different data types as per your requirements.

## Disclaimer
This repository contains a data migration script that is designed to migrate data into a PostgreSQL database, although the provided functions currently handles the migration of data, it may require additional modifications to fit specific use cases and does not cover all possible scenarios, so it's recommended to review and modify the function to suit your specific needs including data validation and transformation. Feel free to modify and adjust the sentence based on your preferences and specific requirements.


## License    
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
