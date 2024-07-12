const fs = require('fs');

function load_config(input: any, definition: any) {
    // Read JSON config files
    // const config1 = JSON.parse(fs.readFileSync(mainConfigPath, 'utf8'));
    // const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'));

    console.info = () => { };

    // Input
    // console.log (definition);
    console.info("\n== Extract input file (.from) information");
    let from0 = input.from.table;
    let parts = from0.split('.');

    let fromAppId = parts[0];
    let fromDbId = parts[1];
    let fromSchemaId = parts[2];
    let fromTableName = parts[3];
    // parts.pop();
    // var fromColumn = input.from.columns;
    let fromCsvPath = "csv/" + fromAppId + "/" + parts.join('.');

    console.info(fromAppId);
    console.info(fromDbId);
    console.info(fromSchemaId);
    console.info(fromTableName);
    console.info(fromCsvPath);

    console.info("\n== Extract input target (.to) information");
    let to0 = input.to.table;
    parts = to0.split('.');

    let toDbId = parts[0];
    let toSchemaId = parts[1];
    let toTableName = parts[2];
    // var toTableFull = toDbId + "." + toSchemaId + "." + toTableName;
    // var toColumnName = parts[3]
    let commandFilePath = "command/" + definition.appId + "/" + definition.appId + "." + parts.join('.');

    console.info(toDbId);
    // console.info(toSchemaId);
    // console.info(toTableName);
    // console.info(toColumnName);
    console.info(commandFilePath);

    // Output
    console.info("\n== Extract output information (" + input.to.table + ")");
    let output0 = definition.outputs;
    let outputTo = output0.find((item: any) => item.table === input.to.table);

    // console.log(outputTo);
    // console.log(input.to.table);
    if (outputTo !== undefined) {
        outputTo.appId = definition.appId;
        outputTo.filePath = "csv/" + definition.appId + "/" + definition.appId + "." + toDbId + "." + toSchemaId + "." + toTableName;
        // console.info(outputTo);
        // var outputToColumns = outputTo.columns;
        // databaseTo.outputColumns = outputTo.columns;

        console.info(outputTo);
        // console.info(outputToColumns);
    }/*  */

    // Database
    console.info("\n== Extract database information");
    let databases0 = definition.databases;

    let databaseTo = databases0.find((item: any) => item.name === toDbId);
    databaseTo.table = toTableName;
    databaseTo.schema = toSchemaId;
    databaseTo.fromCsvPath = fromCsvPath;
    databaseTo.commandFilePath = commandFilePath;
    // databaseTo.column = toColumnName;
    // var databaseToType = databaseTo.type;

    console.info(databaseTo);
    // console.info(databaseToType);
    // databaseTo.outputColumns = outputTo.columns;

    // console.info(outputTo);
    return { databaseTo, outputTo };
}

module.exports = load_config;