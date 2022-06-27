const ADODB = require('node-adodb');
const fs = require('fs');
const path = require('path');

const dbName = "dbAccess.mdb"
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=database/dbAccess.mdb;');

/**
 * @returns Table structures
 */
const QuerySchemas = async () => {
    try {
        const schemas = await connection.schema(20)
        return schemas
    } catch (error) {
        console.log(error)
    }
}

const QueryAllData = async (tableName) => {
    try {
        const schemas = await connection.query(`SELECT * FROM [${tableName}]`)
        return schemas
    } catch (error) {
        console.log(error);
    }
}

QuerySchemas()
    .then((schemas) => {
        const tablesName = schemas
            .filter((el) => (el.TABLE_TYPE === 'TABLE'))
            .map((el) => el.TABLE_NAME)
        return tablesName
    })
    .then(tablesName => {

        tablesName.map((nameOfTable) => {
            QueryAllData(nameOfTable)
                .then(data => {
                    jsonFilesGenerator(nameOfTable, data);
                })
                .catch(error => console.error(error))
        })
    })
    .catch(error => error)


async function jsonFilesGenerator(nameOfTable, data) {

    const json = JSON.stringify(data, null, 2)

    fs.mkdir(path.join(__dirname, 'json-data'), { recursive: true }, (err) => {
        if (err) return console.error('error Mkdir', err)
    })
    fs.writeFile(path.join(`json-data/${nameOfTable}.json`), json, function (err) {
        if (err) return console.error('Error Write File', err)

    })
}