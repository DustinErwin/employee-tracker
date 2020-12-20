const inquirer = require("inquirer");
const add = require("./assets/add");
const update = require("./assets/update");
const view = require("./assets/view");
const del = require("./assets/delete");

module.exports = () => {
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
          add();
          break;

        case "View":
          view();
          break;

        case "Update":
          update();
          break;

        case "Delete":
          del();
          break;
      }
    });
};
