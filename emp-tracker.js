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
        var query = `INSERT INTO department ( deptName)
          VALUES ("${answer.name}");`;
        connection.query(query, function (err, res) {
          if (err) throw err;
          console.log(res);
        });
        connection.query(`SELECT * FROM department`, function (err, res) {
          if (err) throw err;
          console.table(res);
          userAction();
        });
      });
  }

  function addRole() {
    const qd = queryDepartments();
    console.log(qd);
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
          choices: qd,
        },
      ])
      .then(function (answer) {
        var query = `INSERT INTO role (title, salary, department_id)
          VALUES ("${answer.title}", "${answer.salary}", "${answer.dept}");`;
        connection.query(query, function (err, res) {
          if (err) throw err;
          console.log(res);
        });
        connection.query(`SELECT * FROM role`, function (err, res) {
          if (err) throw err;
          console.table(res);
          userAction();
        });
      });
  }

  function addEmployee() {
    console.log("addEmployee");
  }

  function queryDepartments() {
    connection.query(`SELECT deptName FROM department `, (err, res) => {
      if (err) throw err;
      const depts = res.map((nombre) => nombre.deptName);

      return depts;
    });
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
    });
  }

  function viewRole() {
    connection.query(`SELECT * FROM role `, (err, res) => {
      if (err) throw err;
      console.table(res);
    });
  }

  function viewEmployee() {
    connection.query(`SELECT * FROM employee `, (err, res) => {
      if (err) throw err;
      console.table(res);
    });
  }

  function viewEmpByManager(manager) {
    connection.query(
      `SELECT * FROM employee WHERE manager_id = ${manager} `,
      (err, res) => {
        if (err) throw err;
        console.table(res);
      }
    );
  }

  function viewSalaryBudget() {
    console.log("viewSalaryBudget");
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
    console.log("updRole");
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
