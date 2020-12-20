const mysql = require("mysql");

const main = require("./main");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "rootroot",
  database: "employeeDB",
});

connection.connect(function (err) {
  if (err) throw err;
  main();
});
