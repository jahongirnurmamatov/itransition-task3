const asciiTable = require('ascii-table');
const table = new asciiTable();

table.setHeading('Name', 'Age', 'City');
table.addRow('Alice', 30, 'New York');
table.addRow('Bob', 25, 'Los Angeles');
table.addRow('Charlie', 35, 'Chicago');


console.log(table.toString());