// app.ts

import * as XLSX from 'xlsx';

interface IndexEntry {
  [key: string]: string;
}

const processSpreadsheet = (filePath: string): IndexEntry[] => {
  try {
    // Read the spreadsheet
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Parse and process the data
    const data: any[] = XLSX.utils.sheet_to_json(sheet);

    // Validate each entry
    if (data.length === 0) {
      throw new Error('Spreadsheet is empty.');
    }

    // Generate the stream of JSON lines
    const headerRow = Object.keys(data[0]);
    const jsonLines = data.map((entry) => {
      const jsonEntry = Object.fromEntries(headerRow.map((header) => [header, entry[header]]));
      return jsonEntry;
    });

    return jsonLines;
  } catch (error: any) {
    console.error(`Error processing spreadsheet: ${error.message}`);
    process.exit(1);
  }
};

const search = (data: IndexEntry[], query: string): IndexEntry[] => {
  const results = data.filter((entry) =>
    Object.values(entry).some((value) => String(value).toLowerCase().includes(query.toLowerCase()))
  );

  return results;
};

// Read the command line arguments
const args = process.argv.slice(2); // Exclude the first two elements which are 'node' and the script name

if (args.length !== 2) {
  console.error('Usage: node app.js <spreadsheetPath> <searchQuery>');
  process.exit(1);
}

const spreadsheetPath = args[0];
const searchQuery = args[1];

// Process the spreadsheet and output the stream of JSON lines
const searchData: IndexEntry[] = processSpreadsheet(spreadsheetPath);
console.log('Data from spreadsheet:', searchData);

// Perform the search
const searchResults = search(searchData, searchQuery);

console.log('Search Results:');
console.log(searchResults);
