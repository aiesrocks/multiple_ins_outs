function sqlServerDelete(databaseTo: any, row: any) {
    var outputString = 'DELETE FROM ' + databaseTo.table + ' WHERE ' + databaseTo.column + ' = ' + row[databaseTo.column] + ';';
    return outputString;
}

module.exports = sqlServerDelete;