function sqlServerDeletex(databaseTo: any, input: any, row: any) {
    var outputString = 'DELETE FROM ' + databaseTo.table + ' WHERE ';
    // outputString += input.to.columns[0] + ' = ' + row[input.from.columns[0]] + ';';
    for (let i = 0; i < input.to.columns.length; i++) {
        outputString += input.to.columns[i] + ' = \'' + row[input.from.columns[i]] +"'";
        if (i < input.to.columns.length - 1) {
            outputString += ' AND ';
        }
    }
    outputString += ';';

    return outputString;
}

module.exports = sqlServerDeletex;