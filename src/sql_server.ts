import * as fs from 'fs';
const { Sequelize } = require('sequelize');

// Setup a new Sequelize instance for SQLite
// const sequelize = new Sequelize('sqlite::memory:'); // Example for an in-memory database

function where_clause(columnsTo: any, columnsFrom: any, row: any) {
  var whereString = ' WHERE ';
  for (let i = 0; i < columnsTo.length; i++) {
    whereString += columnsTo[i] + ' = \'' + row[columnsFrom[i]] + "'";
    if (i < columnsTo.length - 1) {
      whereString += ' AND ';
    }
  }
  return whereString;
}

async function sqlServerRead(database: any, output: any, input: any, row: any) {
  try {
    var queryString = 'SELECT '
    for (let i = 0; i < output.columns.length; i++) {
      queryString += output.columns[i];
      if (i < output.columns.length - 1) {
        queryString += ', ';
      }
    }
    queryString += ' FROM ' + database.table + where_clause(input.to.columns, input.from.columns, row);
    queryString += ';';

    // console.log(queryString);
    const sequelize = new Sequelize(database.connectionString, {logging: false}); // Example for an in-memory database
    // const sequelize = new Sequelize('sqlite:sqlite/201_01/dbB.db'); // Example for an in-memory database
    const result = await sequelize.query(queryString, {
      type: Sequelize.QueryTypes.SELECT
    });

    var outColumns = output.columns
    for (let i = 0; i < result.length; i++) {
    var outputString = '';            
      for (let j = 0; j < outColumns.length; j++) {
        outputString += result[i][outColumns[j]];        
        if (j < outColumns.length - 1) {
          outputString += ',';
        }
      }
      // console.log(outputString);
      console.log('Appended to file:', output.filePath, outputString)
      fs.appendFile(output.filePath, outputString + '\n', (err) => {
        if (err) {
          console.error('Error appending to file:', err);
        }        
      });      
    }
  } catch (error) {
    console.error('Error executing raw query:', error);
  }
}

function sqlServerDelete(databaseTo: any, input: any, row: any) {
  // console.log(row);
  // console.log(input.to.columns);
  var outputString = 'DELETE FROM ' + databaseTo.table + where_clause(input.to.columns, input.from.columns, row);
  outputString += ';';

  return outputString;
}

module.exports = { sqlServerDelete, sqlServerRead };