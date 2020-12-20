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

module.exports = function deleteItem() {
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
          delDept();
          break;

        case "Role":
          delRole();
          break;

        case "Employee":
          delEmployee();
          break;
      }
    });

  function delDept() {
    connection.query(`SELECT deptName FROM department`, (err, res) => {
      if (err) throw err;
      const depts = res.map((nombre) => nombre.deptName);
      inquirer
        .prompt([
          {
            name: "dept",
            type: "list",
            message: "Choose department to be removed:",
            choices: depts,
          },
        ])
        .then(function (answer) {
          connection.query(
            `SELECT id FROM department WHERE deptName = "${answer.dept}"`,
            function (err, res) {
              if (err) throw err;

              id = res.map((nombre) => nombre.id);

              var query = `DELETE FROM department
                            WHERE id = ${id}`;
              connection.query(query, function (err, res) {
                if (err) throw err;
                console.log("\nDepartment Deleted!");
                userAction();
              });
              connection.query(`SELECT * FROM department`, function (err, res) {
                if (err) throw err;
                console.table(res);
                console.log("\nDepartment Deleted!");
                userAction();
              });
            }
          );
        });
    });
    console.log("delDept");
  }

  function delRole() {
    connection.query(`SELECT title FROM role`, (err, res) => {
      if (err) throw err;
      const roles = res.map((nombre) => nombre.title);
      inquirer
        .prompt([
          {
            name: "role",
            type: "list",
            message: "Choose role to be removed:",
            choices: roles,
          },
        ])
        .then(function (answer) {
          connection.query(
            `SELECT id FROM role WHERE title = "${answer.role}"`,
            function (err, res) {
              if (err) throw err;
              let id = res.map((nombre) => nombre.id);
              var query = `DELETE FROM role
                            WHERE id = ${id}`;
              connection.query(query, function (err, res) {
                if (err) throw err;
              });
              connection.query(`SELECT * FROM role`, function (err, res) {
                if (err) throw err;
                console.table(res);
                console.log("\nRole Deleted!");
                userAction();
              });
            }
          );
        });
    });
  }

  function delEmployee() {
    connection.query(`SELECT * FROM employee`, (err, res) => {
      if (err) throw err;
      console.table(res);

      inquirer
        .prompt([
          {
            name: "id",
            type: "input",
            message: "Enter Id employee to be removed:",
            validate: (title) => {
              if (isNaN(title) === false) {
                return true;
              }
              return "Please enter a valid number.";
            },
          },
        ])
        .then(function (answer) {
          var query = `DELETE FROM employee
                            WHERE id = ${answer.id}`;
          connection.query(query, function (err, res) {
            if (err) throw err;
          });
          connection.query(`SELECT * FROM employee`, function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("\nEmployee Deleted!");
            userAction();
          });
        });
    });
  }
};
