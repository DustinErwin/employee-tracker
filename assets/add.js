module.exports = function addItem() {
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
          addDept();
          break;

        case "Role":
          addRole();
          break;

        case "Employee":
          addEmployee();
          break;
      }
    });

  function addDept() {
    inquirer
      .prompt({
        name: "name",
        type: "input",
        message: "What is the name of the new department?",
      })
      .then(function (answer) {
        var query = `INSERT INTO department (deptName)
            VALUES ("${answer.name}");`;
        connection.query(query, function (err, res) {
          if (err) throw err;
        });
        connection.query(`SELECT * FROM department`, function (err, res) {
          if (err) throw err;
          console.table(res);
          console.log("\nDepartment Added!");
          main();
        });
      });
  }

  function addRole() {
    connection.query(`SELECT deptName FROM department `, (err, res) => {
      if (err) throw err;
      const depts = res.map((nombre) => nombre.deptName);
      inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "What is the title of the new role?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary amount for the new role?",
            validate: (salary) => {
              if (isNaN(salary) === false) {
                return true;
              }
              return "Please enter a valid number.";
            },
          },
          {
            name: "dept",
            type: "list",
            message: "Choose department this role will be assigned to:",
            choices: depts,
          },
        ])
        .then(function (answer) {
          connection.query(
            `SELECT id FROM department WHERE deptName = "${answer.dept}"`,
            function (err, res) {
              if (err) throw err;
              let id = res.map((nombre) => nombre.id);
              var query = `INSERT INTO role (title, salary, department_id)
                            VALUES ("${answer.title}", "${answer.salary}", ${id});`;
              connection.query(query, function (err, res) {
                if (err) throw err;
              });
            }
          );
          connection.query(`SELECT * FROM role`, function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("\nRole Added!");
            main();
          });
        });
    });
  }

  function addEmployee() {
    connection.query(`SELECT title FROM role `, (err, res) => {
      if (err) throw err;
      const roles = res.map((nombre) => nombre.title);
      connection.query(`SELECT * FROM employee `, (err, res) => {
        if (err) throw err;
        console.table(res);
        inquirer
          .prompt([
            {
              name: "first",
              type: "input",
              message: "First Name:",
            },
            {
              name: "last",
              type: "input",
              message: "Last Name:",
            },
            {
              name: "role",
              type: "list",
              message: "What is the employee's role?",
              choices: roles,
            },
            {
              name: "manager",
              type: "input",
              message: "What is this employee's manager's Id?",
              validate: (salary) => {
                if (isNaN(salary) === false) {
                  return true;
                }
                return "Please enter a valid number.";
              },
            },
          ])
          .then(function (answer) {
            connection.query(
              `SELECT id FROM role WHERE title = "${answer.role}"`,
              function (err, res) {
                if (err) throw err;
                let id = res.map((nombre) => nombre.id);
                var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES ("${answer.first}", "${answer.last}", ${id}, ${answer.manager});`;
                connection.query(query, function (err, res) {
                  if (err) throw err;
                });
              }
            );
            connection.query(`SELECT * FROM employee`, function (err, res) {
              if (err) throw err;
              console.table(res);
              console.log("\nEmployee Added!");
              main();
            });
          });
      });
    });
  }
};
