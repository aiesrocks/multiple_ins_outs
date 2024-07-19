import * as fs from 'fs';
import oracledb from 'oracledb';
// const { Sequelize } = require('sequelize');

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

async function oracleRead(database: any, output: any, input: any, row: any) {
  try {
    // console.log("oracleRead: ", database);
    // let tableN = tableName.split('.').pop()?.toUpperCase(); // Oracle is case-sensitive, usually uppercase

    let connection = await oracledb.getConnection({
      user: database.oracleUser,
      password: database.oraclePassword,
      connectionString: database.connectionString
    });


    var queryString = 'SELECT '
    for (let i = 0; i < output.columns.length; i++) {
      queryString += output.columns[i];
      if (i < output.columns.length - 1) {
        queryString += ', ';
      }
    }
    queryString += ' FROM "' + database.schema + '".' + database.table + where_clause(input.to.columns, input.from.columns, row);
    // queryString += ';';

    // console.log('queryString: ', queryString);
    // console.log(database.connectionString);   

    const result = await connection.execute(queryString, [], { outFormat: oracledb.OUT_FORMAT_OBJECT }) as { rows: any[] | undefined };

    // const result = await connection.execute(query, [tableN, tableN], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    // console.log('select: ', result.rows);
    // console.log('queryString: ', queryString);
    if (result.rows) {
      // for (let input of definition.inputs) {      
      let outColumns = output.columns

      for (let i = 0; i < result.rows.length; i++) {
        let outputString = '';
        // Example: Assuming `row` has `index_name` and we have a way to get columns and index type
        // let row = iter as any;
        // console.log("row:", row);
        for (let j = 0; j < outColumns.length; j++) {
          outputString += result.rows[i][outColumns[j].toUpperCase()];
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
        // const ccno = row.CARD_NO;
      }
    }
    // for (let i = 0; i < result.length; i++) {
    //   let outputString = '';
    //   for (let j = 0; j < outColumns.length; j++) {
    //     outputString += result[i][outColumns[j]];
    //     if (j < outColumns.length - 1) {
    //       outputString += ',';
    //     }
    //   }
    //   // console.log(outputString);
    //   // console.log('Appended to file:', output.filePath, outputString)
    //   fs.appendFile(output.filePath, outputString + '\n', (err) => {
    //     if (err) {
    //       console.error('Error appending to file:', err);
    //     }
    //   });
    // }
  } catch (error) {
    console.error('Error executing raw query:', error);
  }
}

function oracleDelete(databaseTo: any, input: any, row: any) {
  // console.log(row);
  // console.log(input.to.columns);
  let outputString = 'DELETE FROM ' + databaseTo.table + where_clause(input.to.columns, input.from.columns, row);
  outputString += ';';

  return outputString;
}


async function oracleListIndexes(database: any, tableName: string) {
  try {
    console.log('Listing indexes for table:', tableName);
    let tableN = tableName.split('.').pop()?.toUpperCase(); // Oracle is case-sensitive, usually uppercase

    let connection = await oracledb.getConnection({
      user: database.oracleUser,
      password: database.oraclePassword,
      connectionString: database.connectionString
    });

    const query = `
      SELECT
        ind.index_name AS "IndexName",
        ind.table_name AS "TableName",
        col.column_name AS "ColumnName",
        ind.uniqueness AS "IsUnique"
      FROM
        user_indexes ind
      JOIN
        user_ind_columns col ON ind.index_name = col.index_name
      WHERE
        ind.table_name = :tableN
        AND ind.index_name NOT IN (
          SELECT
            constraint_name
          FROM
            user_constraints
          WHERE
            constraint_type = 'P'
            AND table_name = :tableN
        )
      ORDER BY
        ind.index_name, col.column_position
    `;

    const result = await connection.execute(query, [tableN, tableN], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    // console.log('Indexes:', result.rows);

    // Assuming `result.rows` contains index names and necessary details for recreation
    const preSqlStatements: string[] = [];
    const postSqlStatements: string[] = [];

    if (result.rows) {
      // for (let input of definition.inputs) {      
      for (let iter of result.rows) {
        // Example: Assuming `row` has `index_name` and we have a way to get columns and index type
        let row = iter as any;
        // console.log("row:", row);
        const indexName = row.IndexName;
        const tableName = row.TableName; // Assuming this is part of the row, or use a variable
        // For simplicity, assuming columns are in a string list format and index type is available
        // const columns = row.COLUMNS.join(', '); // Assuming `COLUMNS` is an array of column names
        const columns = row.ColumnName; // Assuming `COLUMNS` is an array of column names
        const indexType = row.IsUnique; // This needs to be determined or assumed

        preSqlStatements.push(`DROP INDEX ${indexName};`);

        // Adjust the CREATE INDEX statement as needed, especially for unique or other types of indexes
        // let createStatement = `CREATE ${indexType} INDEX ${indexName} ON ${tableName} (${columns});`;
        postSqlStatements.push(`CREATE ${indexType} INDEX ${indexName} ON ${tableName} (${columns});`)
      }

      // const preSql = preSqlStatements.join('\n');
      // const preSqlFile = database.commandFilePath + '-pre';
      // const preSqlFile = 'command/201_02/deleteme.sql';
      console.log('Appended to file:', database.commandFilePath + '-pre');
      // const preSqlFile =
      fs.appendFile(database.commandFilePath + '-pre', preSqlStatements.join('\n'), (err) => {
        if (err) {
          console.error('Error appending to file:', err);
        }
      });
      // console.log('Pre- Statements:', preSqlStatements.join('\n'));

      console.log('Appended to file:', database.commandFilePath + "-post");
      fs.appendFile(database.commandFilePath + "-post", postSqlStatements.join('\n'), (err) => {
        if (err) {
          console.error('Error appending to file:', err);

        }
        // console.log('Non-primary key indexes:', nonPrimaryKeyIndexes[0].sql);
        // return nonPrimaryKeyIndexes;
      });
      // console.log('Post- Statements:', postSqlStatements.join('\n'));

    }
    await connection.close();
  } catch (error) {
    console.error('Error listing indexes for Oracle table:', error);
  }
}


module.exports = { oracleDelete, oracleRead, oracleListIndexes };