// TODO
// * DONE: add an additional input mapping to another table (not in-app cascade which is for DBMS)
// * Add an additional input mapping to the same table (may do in 301_03 to make it depend on both 101_01 and 201_02)
// * DONE: Add DDL commands (both pre- and post-)
// * Add definition for initial app (criteria not from a file) 
//   -> workaround by manually create a CSV file
// * Add cyclic dependency scenario (e.g. A -> B -> A)
// * Done: Add MSSQL support
// * TBC: Add Oracle support
// * Add MySQL support
// * Connect to Kafka

// const fs = require('fs');
import * as fs from 'fs';
import csv from 'csv-parser';
import * as readline from 'readline';
const load_config = require('./config_loader');
const { sqlite3Delete, sqlite3Read, sqlite3ListIndexes } = require('./sqlite3');
const { sqlServerDelete, sqlServerRead, sqlServerListIndexes } = require('./sql_server');
const { oracleDelete, oracleRead, oracleListIndexes } = require('./oracle');

// Get JSON config file paths from command-line arguments
const definitionPath = process.argv[2];
const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'));
// var needOutput: boolean = true;
var resetFiles: boolean = true;

processInputs(definition);

async function processInputs(definition: any) {
  for (let input of definition.inputs) {
    await processInput(input)
      .then(() => console.log('File processing completed.'))
      .catch((error) => console.error('An error occurred:', error));
  }
}


async function processInput(input: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    console.log("\n\n## Load config from: " + definitionPath);
    console.log(input);

    let needOutput: boolean = true;
    const { databaseTo, outputTo } = load_config(input, definition);
    if (outputTo === undefined) {
      needOutput = false;
    }
    // console.log(())

    if (outputTo !== undefined && outputTo.resetFile !== undefined) {
      resetFiles = outputTo.resetFile;
    }
    // console.log("===============");
    // console.log(outputTo);
    // console.log(databaseTo.connectionString);
    // sqlite3Read(databaseTo.connectionString);

    if (resetFiles) {
      let files: string[] = [];
      try {
        files = [outputTo.filePath, databaseTo.commandFilePath, databaseTo.commandFilePath + "-pre", databaseTo.commandFilePath + "-post"];
      } catch (err) {
        files = [databaseTo.commandFilePath, databaseTo.commandFilePath + "-pre", databaseTo.commandFilePath + "-post"];
      }
      for (let file of files) {
        console.log("Deleting files: " + file);
        try {
          fs.unlinkSync(file);
          // console.log("Successfully deleted file: " + outputTo.filePath);
        } catch (err) {
          // console.error("Error deleting file: " + outputTo.filePath, err);
        }
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
    }

    // Creating DDL commands
    let outputString = '';
    if (databaseTo.type === 'sqlite3') {
      await sqlite3ListIndexes(databaseTo, input.to.table);
    } else if (databaseTo.type === 'sqlserver') {
      await sqlServerListIndexes(databaseTo, input.to.table);
      // console.warn('Microsoft SQL Server is not supported yet');
      // throw ('Microsoft SQL Server is not supported yet')
    } else if (databaseTo.type === 'oracle') {
      await oracleListIndexes(databaseTo, input.to.table);      
      // console.warn('Oracle is not supported yet');
      // throw ('Oracle is not supported yet')
    } else {
      throw ('Invalid database type');
      // console.warn('Error: Invalid database type');
    }
    // console.log(outputString);

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
      // console.log("databaseTo.type: " + databaseTo.type);
      if (databaseTo.type === 'sqlite3') {
        // console.log(outputTo);

        // Creating subsetting commands
        commandString = sqlite3Delete(databaseTo, input, row);
        console.log("Appending to file: " + databaseTo.commandFilePath);
        fs.appendFile(databaseTo.commandFilePath, commandString + '\n', (err) => {
          if (err) {
            console.error('Error appending to file:', err);
          }
        });

        if (needOutput) {
          // Create CSV for downstream applications
          outputString = sqlite3Read(databaseTo, outputTo, input, row);
        }
      } else if (databaseTo.type === 'sqlserver') {
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
        // console.warn('Microsoft SQL Server is not supported yet');
        // throw ('Microsoft SQL Server is not supported yet')
      } else if (databaseTo.type === 'oracle') {
        commandString = oracleDelete(databaseTo, input, row);
        console.log("Appending to file: " + databaseTo.commandFilePath);
        fs.appendFile(databaseTo.commandFilePath, commandString + '\n', (err) => {
          if (err) {
            console.error('Error appending to file:', err);
          }
        });

        if (needOutput) {
          // Create CSV for downstream applications
          outputString = oracleRead(databaseTo, outputTo, input, row);
        }        
        // console.warn('Oracle is not supported yet');
        // throw ('Oracle is not supported yet')
      } else {
        throw ('Invalid database type');
        // console.warn('Error: Invalid database type');
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