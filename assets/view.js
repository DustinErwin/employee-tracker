const mysql = require("mysql");
const inquirer = require("inquirer");

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

module.exports = function viewItem() {
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
      viewItem();
    });
  }

  function viewRole() {
    connection.query(`SELECT * FROM role `, (err, res) => {
      if (err) throw err;
      console.table(res);
      viewItem();
    });
  }

  function viewEmployee() {
    connection.query(`SELECT * FROM employee `, (err, res) => {
      if (err) throw err;
      console.table(res);
      viewItem();
    });
  }
};
