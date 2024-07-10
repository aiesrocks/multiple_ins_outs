// const fs = require('fs');
import * as fs from 'fs';
import csv from 'csv-parser';
const load_config = require('./config_loader');
const { sqlServerDelete, sqlServerRead } = require('./sql_server');

// Get JSON config file paths from command-line arguments
const definitionPath = process.argv[2];
const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'));

for (let input of definition.inputs) {

  console.log("## Load config from: " + definitionPath);

  var { databaseTo, outputTo } = load_config(input, definition);
  // console.log("===============");
  // console.log(outputTo);
  // console.log(databaseTo.connectionString);
  // sqlServerRead(databaseTo.connectionString);

  // Read and parse CSV data file
  const data = [];
  console.log("Deleting files: " + outputTo.filePath);
  console.log("Deleting files: " + databaseTo.commandFilePath);
  fs.unlink(outputTo.filePath, (err) => { });
  fs.unlink(databaseTo.commandFilePath, (err) => { });
  console.log("Opening file: " + databaseTo.fromCsvPath);

  // Prepare header for output file
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

        // Create CSV for downstream applications
        outputString = sqlServerRead(databaseTo, outputTo, input, row);

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