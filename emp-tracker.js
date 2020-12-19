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

  userAction();
});

function userAction() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["Add", "View", "Update", "Delete"],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add":
          addItem();
          break;

        case "View":
          viewItem();
          break;

        case "Update":
          updateItem();
          break;

        case "Delete":
          deleteItem();
          break;
      }
    });
}

function addItem() {
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
          userAction();
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
                          VALUES ("${answer.title}", "${answer.salary}", "${id}");`;
              connection.query(query, function (err, res) {
                if (err) throw err;
              });
            }
          );
          connection.query(`SELECT * FROM role`, function (err, res) {
            if (err) throw err;
            userAction();
          });
        });
    });
  }

  function addEmployee() {
    console.log("addEmployee");
  }
}

function viewItem() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Which?",
      choices: [
        "Department",
        "Role",
        "Employee",
        "Employee by Manager",
        "Total Salary Budget",
      ],
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

        case "Employee by Manager":
          viewEmpByManager();
          break;

        case "Total Salary Budget":
          viewSalaryBudget();
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

  function viewEmpByManager(manager) {
    connection.query(`SELECT * FROM employee `, (err, res) => {
      if (err) throw err;
      console.table(res);
      viewItem();

      inquirer.prompt([
        {
          name: "action",
          type: "rawlist",
          message: "Which manager?",
          choices: "",
        },
      ]);
      console.log("Needs Inquirer!");
      // connection.query(
      //   `SELECT * FROM employee WHERE manager_id = ${manager} `,
      //   (err, res) => {
      //     if (err) throw err;
      //     console.table(res);
      //     viewItem();
      //   }
      // );
    });
  }

  function viewSalaryBudget() {
    connection.query(
      `SELECT SUM(salary) AS totalBudget FROM role;`,
      (err, res) => {
        if (err) throw err;

        console.log(res[0].totalBudget);

        viewItem();
      }
    );
  }
}

function updateItem() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Which?",
      choices: ["Role", "Manager"],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Role":
          updRole();
          break;

        case "Manager":
          updManager();
          break;
      }
    });

  function updRole() {
    connection.query(`SELECT * FROM role`, (err, res) => {
      if (err) throw err;
      console.table(res);
    });
    connection.query(`SELECT id, deptName FROM department`, (err, res) => {
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
                console.log("\nUpdate Made!");
              });
            }
          );
          connection.query(`SELECT * FROM role`, function (err, res) {
            if (err) throw err;
            userAction();
          });
        });
    });
  }

  function updManager() {
    console.log("updManager");
  }
}

function deleteItem() {
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
    console.log("delDept");
  }

  function delRole() {
    console.log("delRole");
  }

  function delEmployee() {
    console.log("delEmployee");
  }
}
