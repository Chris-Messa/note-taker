const fs = require('fs');
const util = require('util');

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) => 
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err? console.error(err) : console.info(`\nData written to ${destination}`)
    );

module.exports = { readFromFile, writeToFile, readAndAppend };

