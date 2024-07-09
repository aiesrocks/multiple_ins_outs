const fs = require('fs');
import csv from 'csv-parser';
const load_config = require('./config_loader');
const sqlServerDelete = require('./sql_server_delete');

// Get JSON config file paths from command-line arguments
const definitionPath = process.argv[2];
const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'));

for (let input of definition.inputs) {

  console.log("## Load config for: " + input + " ##");

  var { fromFileName, databaseTo } = load_config(input, definition);


  // function load_config() {
  //   // Read JSON config files
  //   // const config1 = JSON.parse(fs.readFileSync(mainConfigPath, 'utf8'));
  //   const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'));

  //   // Input
  //   console.log("== Extract input file (.from) information from \"" + definition.inputs[0].from + "\" ==");
  //   var from0 = definition.inputs[0].from;
  //   var parts = from0.split('.');

  //   var fromAppId = parts[0];
  //   var fromDbId = parts[1];
  //   var fromSchemaId = parts[2];
  //   var fromTableName = parts[3];
  //   var fromColumnName = parts.pop();
  //   fromFileName = "csv/" + fromAppId + "/" + parts.join('.');

  //   console.log(fromAppId);
  //   console.log(fromDbId);
  //   console.log(fromSchemaId);
  //   console.log(fromTableName);
  //   console.log(fromColumnName);
  //   console.log(fromFileName);

  //   console.log("== Extract input target (.to) information from \"" + definition.inputs[0].to + "\" ==");
  //   var to0 = definition.inputs[0].to;
  //   parts = to0.split('.');


  //   var toDbId = parts[0];
  //   var toSchemaId = parts[1];
  //   var toTableName = parts[2];
  //   var toTableFull = toDbId + "." + toSchemaId + "." + toTableName;
  //   var toColumnName = parts[3]


  //   console.log(toDbId);
  //   console.log(toSchemaId);
  //   console.log(toTableName);
  //   console.log(toColumnName);

  //   // Output
  //   console.log("== Extract output information from \"" + definition.outputs + "\" ==");
  //   var output0 = definition.outputs;

  //   var outputTo = output0.find((item: any) => item.tabular === toTableFull);
  //   var outputToColumns = outputTo.columns;

  //   console.log(outputTo);
  //   console.log(outputToColumns);

  //   // Database
  //   console.log("== Extract database information from \"" + definition.databases + "\" ==");
  //   var databases0 = definition.databases;

  //   var databaseTo = databases0.find((item: any) => item.name === toDbId);
  //   databaseToType = databaseTo.type;

  //   console.log(databaseTo);
  //   console.log(databaseToType);
  // }
  // 
  // 
  // load_config();


  // Read and parse CSV data file
  // var fromFileName="csv/" + input.from.table;
  const data = [];
  console.log("\nOpening file: " + fromFileName);
  fs.createReadStream(fromFileName)
    .pipe(csv())
    .on('data', (row: any) => { // Explicitly specify the type of 'row' as 'any'

      let outputString = '';

      if (databaseTo.type === 'sqlserver') {
        outputString = sqlServerDelete(databaseTo, row);
      } else if (databaseTo.type === 'oracle') {
        outputString = 'Oracle is not supported yet';
      } else {
        outputString = 'Error';
        throw 'Invalid database type';
      }

      data.push(row);
      console.log("\n"+outputString);
      console.log(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      // Here you can use your config and data
    })
}