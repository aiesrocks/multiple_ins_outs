// TODO
// * add an additional input mapping to another table (not in-app cascade which is for DBMS)
// * Add an additional input mapping to the same table (total of 3 mappings now)
// * Add DDL commands
// * Add definition for initial app (criteria not from a file) 
//   -- workaround by manually create a CSV file
// * Add cyclic dependency scenario (e.g. A -> B -> A)
// * Convert SQLite3 to MSSQL
// * Add Oracle support
// * Add MySQL support
// * Connect to Kafka

// const fs = require('fs');
import * as fs from 'fs';
import csv from 'csv-parser';
const load_config = require('./config_loader');
const { sqlServerDelete, sqlServerRead } = require('./sql_server');

// Get JSON config file paths from command-line arguments
const definitionPath = process.argv[2];
const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'));
var needOutput: boolean = true;

for (let input of definition.inputs) {

  console.log("\n\n## Load config from: " + definitionPath);
  console.log(input);

  var { databaseTo, outputTo } = load_config(input, definition);
  if (outputTo === undefined) {
    needOutput = false;
  }
  // console.log("===============");
  // console.log(outputTo);
  // console.log(databaseTo.connectionString);
  // sqlServerRead(databaseTo.connectionString);

  // Read and parse CSV data file
  const data = [];
  if (needOutput) {
    console.log("Deleting files: " + outputTo.filePath);
    try {
      fs.unlinkSync(outputTo.filePath);
      // console.log("Successfully deleted file: " + outputTo.filePath);
    } catch (err) {
      // console.error("Error deleting file: " + outputTo.filePath, err);
    }
    
  }
  console.log("Deleting files: " + databaseTo.commandFilePath);
  try {
    fs.unlinkSync(databaseTo.commandFilePath);
    // console.log("Successfully deleted file: " + databaseTo.commandFilePath);
  } catch (err) {
    // console.error("Error deleting file: " + databaseTo.commandFilePath, err);
  }

  // Prepare header for output file
  if (needOutput) {
    let headerString = '';
    for (let j = 0; j < outputTo.columns.length; j++) {
      headerString += outputTo.columns[j];
      if (j < outputTo.columns.length - 1) {
        headerString += ',';
      }
    }
    console.log('Start header of file:', outputTo.filePath, headerString)
    fs.appendFile(outputTo.filePath, headerString + '\n', (err) => {
      if (err) {
        console.error('Error creating file:', err);
      }
    });
  }

  console.log("Opening file: " + databaseTo.fromCsvPath);
  fs.createReadStream(databaseTo.fromCsvPath)
    .pipe(csv())
    .on('data', (row: any) => { // Explicitly specify the type of 'row' as 'any'

      let outputString = '';
      let commandString = '';
      // let headerString = '';

      console.log(row);
      if (databaseTo.type === 'sqlserver') {
        // console.log(outputTo);
        // Creating subsetting commands
        commandString = sqlServerDelete(databaseTo, input, row);
        console.log("Appending to file: " + databaseTo.commandFilePath);
        fs.appendFile(databaseTo.commandFilePath, commandString + '\n', (err) => {
          if (err) {
            console.error('Error appending to file:', err);
          }
        });

        if (needOutput) {
          // Create CSV for downstream applications
          outputString = sqlServerRead(databaseTo, outputTo, input, row);
        }

      } else if (databaseTo.type === 'oracle') {
        outputString = 'Oracle is not supported yet';
      } else {
        outputString = 'Error';
        throw 'Invalid database type';
      }

      data.push(row);
      // console.log(outputString);
      // console.log(commandString);
      // console.log(row);

    })

  // .on('end', () => {
  //   console.log('CSV file successfully processed');
  //   // Here you can use your config and data
  // })
}