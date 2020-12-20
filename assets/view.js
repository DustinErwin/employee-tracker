module.exports = function viewItem() {
  const mysql = require("mysql");
  const inquirer = require("inquirer");
  const main = require("../main");

  const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "rootroot",
    database: "employeeDB",
  });

  connection.connect(function (err) {
    if (err) throw err;
  });

  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Which?",
      choices: ["Department", "Role", "Employee"],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Department":
          viewDept();
          break;

        case "Role":
          viewRole();
          break;

        case "Employee":
          viewEmployee();
          break;
      }
    });

  function viewDept() {
    connection.query(`SELECT * FROM department `, (err, res) => {
      if (err) throw err;
      console.table(res);
      main();
    });
  }

  function viewRole() {
    connection.query(`SELECT * FROM role `, (err, res) => {
      if (err) throw err;
      console.table(res);
      main();
    });
  }

  function viewEmployee() {
    connection.query(`SELECT * FROM employee `, (err, res) => {
      if (err) throw err;
      console.table(res);
      main();
    });
  }
};
