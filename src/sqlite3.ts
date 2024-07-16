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

async function sqlite3Read(database: any, output: any, input: any, row: any) {
  // console.log(row);
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
    // console.log(database.connectionString);
    const sequelize = new Sequelize(database.connectionString, { logging: false }); // Example for an in-memory database
    // const sequelize = new Sequelize('sqlite:sqlite/201_01/dbB.db'); // Example for an in-memory database
    const result = await sequelize.query(queryString, {
      type: Sequelize.QueryTypes.SELECT
    });

    // console.log(result);
    let outColumns = output.columns
    for (let i = 0; i < result.length; i++) {
      let outputString = '';
      for (let j = 0; j < outColumns.length; j++) {
        outputString += result[i][outColumns[j]];
        if (j < outColumns.length - 1) {
          outputString += ',';
        }
      }
      // console.log(outputString);
      // console.log('Appended to file:', output.filePath, outputString)
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

function sqlite3Delete(databaseTo: any, input: any, row: any) {
  // console.log(row);
  // console.log(input.to.columns);
  let outputString = 'DELETE FROM ' + databaseTo.table + where_clause(input.to.columns, input.from.columns, row);
  outputString += ';';

  return outputString;
}

async function sqlite3ListIndexes(database: any, tableName: string) {
  try {
    console.log('Listing indexes for table:', tableName);
    let table0 = tableName;
    let parts = table0.split('.');
    let tableN = parts.pop();
    // console.log('tableN:', tableN);

    // Query sqlite_master to get all index names for the specified table
    const sequelize = new Sequelize(database.connectionString, { logging: false });
    // const indexes = await sequelize.query(
    //   "SELECT name, sql FROM sqlite_master WHERE type = 'index' AND tbl_name = :tableName AND sql NOT NULL",
    //   {
    //     replacements: { tableName },
    //     type: sequelize.QueryTypes.SELECT,
    //   }
    // );
    let queryIndex = "SELECT name, sql FROM sqlite_master WHERE type = 'index' AND tbl_name = :tableN AND sql NOT NULL"
    // const indexes = await sequelize.query(
    //   "SELECT name, sql FROM sqlite_master WHERE type = 'index' AND tbl_name = 'cards' AND sql NOT NULL", { type: sequelize.QueryTypes.SELECT, });
    // const indexes = await sequelize.query(queryIndex, { type: sequelize.QueryTypes.SELECT, });
    const indexes = await sequelize.query(queryIndex, {replacements: { tableN },  type: sequelize.QueryTypes.SELECT,
    });

    // Filter out indexes that are automatically created for primary keys
    // This is a basic filter assuming primary key indexes do not contain specific patterns in their SQL definition
    // Adjust the filtering logic based on your database's naming conventions or requirements
    const nonPrimaryKeyIndexes = indexes.filter((index: any) => !index.sql.includes('PRIMARY KEY'));

    // console.log(nonPrimaryKeyIndexes);
    for (let index of nonPrimaryKeyIndexes) {
      // console.log('Non-primary key indexes:"', index.sql, '"');
      console.log('Appended to file:', database.commandFilePath + "-post")
      fs.appendFile(database.commandFilePath + "-post", index.sql.replace(/\r\n$/, ';\n'), (err) => {
        if (err) {
          console.error('Error appending to file:', err);

        }
        // console.log('Non-primary key indexes:', nonPrimaryKeyIndexes[0].sql);
        // return nonPrimaryKeyIndexes;
      })

      console.log('Appended to file:', database.commandFilePath + "-pre")
      fs.appendFile(database.commandFilePath + "-pre", 'DROP INDEX ' + index.name + ';\n', (err) => {
        if (err) {
          console.error('Error appending to file:', err);

        }
        // console.log('Non-primary key indexes:', nonPrimaryKeyIndexes[0].sql);
        // return nonPrimaryKeyIndexes;
      })
    }
  } catch (error) {
    console.error('Error listing table indexes:', error);
  }
}


module.exports = { sqlite3Delete, sqlite3Read, sqlite3ListIndexes };