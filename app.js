"use strict";
// app.ts
Object.defineProperty(exports, "__esModule", { value: true });
var XLSX = require("xlsx");
var processSpreadsheet = function (filePath) {
    try {
        // Read the spreadsheet
        var workbook = XLSX.readFile(filePath);
        var sheet = workbook.Sheets[workbook.SheetNames[0]];
        // Parse and process the data
        var data = XLSX.utils.sheet_to_json(sheet);
        // Validate each entry
        if (data.length === 0) {
            throw new Error('Spreadsheet is empty.');
        }
        // Generate the stream of JSON lines
        var headerRow_1 = Object.keys(data[0]);
        var jsonLines = data.map(function (entry) {
            var jsonEntry = Object.fromEntries(headerRow_1.map(function (header) { return [header, entry[header]]; }));
            return jsonEntry;
        });
        return jsonLines;
    }
    catch (error) {
        console.error("Error processing spreadsheet: ".concat(error.message));
        process.exit(1);
    }
};
var search = function (data, query) {
    var results = data.filter(function (entry) {
        return Object.values(entry).some(function (value) { return String(value).toLowerCase().includes(query.toLowerCase()); });
    });
    return results;
};
// Read the command line arguments
var args = process.argv.slice(2); // Exclude the first two elements which are 'node' and the script name
if (args.length !== 2) {
    console.error('Usage: node app.js <spreadsheetPath> <searchQuery>');
    process.exit(1);
}
var spreadsheetPath = args[0];
var searchQuery = args[1];
// Process the spreadsheet and output the stream of JSON lines
var searchData = processSpreadsheet(spreadsheetPath);
console.log('Data from spreadsheet:', searchData);
// Perform the search
var searchResults = search(searchData, searchQuery);
console.log('Search Results:');
console.log(searchResults);
