// TODO
// * DONE: add an additional input mapping to another table (not in-app cascade which is for DBMS)
// * Add an additional input mapping to the same table (may do in 301_03 to make it depend on both 101_01 and 201_02)
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
import * as readline from 'readline';
const load_config = require('./config_loader');
const { sqlServerDelete, sqlServerRead } = require('./sql_server');

// Get JSON config file paths from command-line arguments
const definitionPath = process.argv[2];
const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'));
var needOutput: boolean = true;

processInputs(definition);

async function processInputs(definition: any) {
  for (let input of definition.inputs) {
    await processInput(input)
      .then(() => console.log('File processing completed.'))
      .catch((error) => console.error('An error occurred:', error));
  }
}


async function processInput(input: any): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log("\n\n## Load config from: " + definitionPath);
    console.log(input);

    let needOutput: boolean = true;
    const { databaseTo, outputTo } = load_config(input, definition);
    if (outputTo === undefined) {
      needOutput = false;
    }
    // console.log("===============");
    // console.log(outputTo);
    // console.log(databaseTo.connectionString);
    // sqlServerRead(databaseTo.connectionString);
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
      console.log("Successfully deleted file: " + databaseTo.commandFilePath);
    } catch (err) {
      console.error("Error deleting file: " + databaseTo.commandFilePath, err);
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

    // Read and parse CSV data file
    // const data = [];
    console.log("Opening file: " + databaseTo.fromCsvPath + " for " + databaseTo.commandFilePath);
    const stream = fs.createReadStream(databaseTo.fromCsvPath);
    const csvReader = stream.pipe(csv());

    csvReader.on('data', (row: any) => { // Explicitly specify the type of 'row' as 'any'
      let outputString = '';
      let commandString = '';
      let headerString = '';
      // console.log(row);
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

      // data.push(row);
      // console.log(outputString);
      // console.log(commandString);
      // console.log(row);

    })
      .on('error', (err) => {
        console.error('Error parsing CSV:', err);
      })

    csvReader.on('end', () => {
      // csvReader.close();
      resolve();
      console.log('CSV file successfully processed: ' + databaseTo.fromCsvPath);
      // Here you can use your config and data
    })
  });
}