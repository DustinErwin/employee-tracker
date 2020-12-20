module.exports = function updRole() {
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

  connection.query(`SELECT * FROM role`, (err, res) => {
    if (err) throw err;
    console.table(res);
  });
  connection.query(`SELECT deptName FROM department`, (err, res) => {
    if (err) throw err;
    const depts = res.map((nombre) => nombre.deptName);
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Please enter the Id for the role:",
          validate: (title) => {
            if (isNaN(title) === false) {
              return true;
            }
            return "Please enter a valid number.";
          },
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary amount for the role?",
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
            var query = `UPDATE role SET salary = ${answer.salary}, department_id = ${id}
                            WHERE id = ${answer.title};`;
            connection.query(query, function (err, res) {
              if (err) throw err;
            });
          }
        );
        connection.query(`SELECT * FROM role`, function (err, res) {
          if (err) throw err;
          console.table(res);
          console.log("\nRole Updated!");
          main();
        });
      });
  });
};
