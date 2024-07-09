const fs = require('fs');

function load_config(input: any, definition: any) {
    // Read JSON config files
    // const config1 = JSON.parse(fs.readFileSync(mainConfigPath, 'utf8'));
    // const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'));

    // Input
    console.log("\n== Extract input file (.from) information from \"" + input.from + "\" ==");
    var from0 = input.from.table;
    var parts = from0.split('.');

    var fromAppId = parts[0];
    var fromDbId = parts[1];
    var fromSchemaId = parts[2];
    var fromTableName = parts[3];
    // parts.pop();
    // var fromColumn = input.from.columns;
    var fromFileName = "csv/" + fromAppId + "/" + parts.join('.');

    console.log(fromAppId);
    console.log(fromDbId);
    console.log(fromSchemaId);
    console.log(fromTableName);
    // console.log(fromColumnName);
    console.log(fromFileName);

    console.log("\n== Extract input target (.to) information from \"" + input.to + "\" ==");
    var to0 = input.to.table;
    parts = to0.split('.');


    var toDbId = parts[0];
    // var toSchemaId = parts[1];
    var toTableName = parts[2];
    // var toTableFull = toDbId + "." + toSchemaId + "." + toTableName;
    // var toColumnName = parts[3]


    console.log(toDbId);
    // console.log(toSchemaId);
    // console.log(toTableName);
    // console.log(toColumnName);

    // Output
    console.log("\n== Extract output information from \"" + definition.outputs + "\" ==");
    var output0 = definition.outputs;

    var outputTo = output0.find((item: any) => item.tabular === input.to.table);
    var outputToColumns = outputTo.columns;

    console.log(outputTo);
    console.log(outputToColumns);

    // Database
    console.log("\n== Extract database information from \"" + definition.databases + "\" ==");
    var databases0 = definition.databases;

    var databaseTo = databases0.find((item: any) => item.name === toDbId);
    databaseTo.table = toTableName;
    // databaseTo.column = toColumnName;
    // var databaseToType = databaseTo.type;

    console.log(databaseTo);
    // console.log(databaseToType);
    
    return { fromFileName, databaseTo };
}

module.exports = load_config;