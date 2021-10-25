const inquirer = require('inquirer');
// Logic for database
const q = require('./lib/dbLogic');
// Better console.table()
const cTable = require('console.table');
// Easily create a fancy title in console. Small helper function (not copied! lol)
const titles = require('./helpers/titles');

const menuQ = [
  {
    name: 'menu',
    type: 'list',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit',
    ],
    message: 'Menu Options',
    required: 'true',
  },
];

const addDept = [
  {
    name: 'dept_name',
    message: 'What is the name of the department?',
    required: 'true',
  },
];

const addRole = [
  {
    name: 'role_name',
    message: 'What is the name of this role?',
    required: 'true',
  },
  {
    name: 'salary',
    message: "What is this role's salary?",
    required: 'true',
  },
  {
    name: 'dept',
    message: 'What is the name of the department of this role?',
    required: 'true',
  },
  {
    name: 'manager',
    type: 'list',
    choices: ['Yes', 'No'],
    message: 'Is this a manager role?',
    required: 'true',
  },
];

const addEmployee = [
  {
    name: 'first_name',
    message: "What is this employee's first name?",
    required: 'true',
  },
  {
    name: 'last_name',
    message: 'How about their last name?',
    required: 'true',
  },
  {
    name: 'role_name',
    message: 'What is the name of their role?',
    required: 'true',
  },
  {
    name: 'manager_name',
    message:
      "If they have a manager, what is their manager's first AND last name?",
  },
];

let updateEmployee = [
  {
    name: 'employee_name',
    type: 'list',
    choices: null,
    message: 'Which employee do you want to update?',
    required: 'true',
  },
  {
    name: 'new_role',
    message: 'What is the name of the new role you want to assign them?',
    required: 'true',
  },
];

async function findEmployees() {
  const employees = await q.employeeNameArray();
  updateEmployee[0].choices = employees;
  return;
}

const handleError = (error) => {
  console.error(error);
  init();
};

function handleResponse(response) {
  switch (true) {
    // For "View"
    case response.includes('View'):
      // Run the view() function
      q.view(response)
        .then((info) => {
          console.log(titles(`Showing all ${response.split(' ')[2]}`));
          console.table(info);
          init();
        })
        .catch((err) => handleError(err));
      break;
    // For "Add"
    case response.includes('Add'):
      let toPrompt;
      // Set the prompt questions to funnel into inquirer.prompt()
      switch (true) {
        case response.includes('department'):
          toPrompt = addDept;
          break;
        case response.includes('role'):
          toPrompt = addRole;
          break;
        case response.includes('employee'):
          toPrompt = addEmployee;
          break;
      }
      // Prompt the set of questions determined
      inquirer
        .prompt(toPrompt)
        // Send the menu option + the prompt data to the add() function
        .then((res) => {
          // Setting the manager option to a boolean value which will be used in add() function
          if (res.manager) {
            res.manager === 'Yes'
              ? (res.manager = true)
              : (res.manager = false);
          }
          q.add(response, res);
        })
        .then((x) => {
          console.log(
            titles(
              `${
                response.split(' ')[2].charAt(0).toUpperCase() +
                response.split(' ')[2].slice(1)
              } Added!`
            )
          );
          init();
        })
        .catch((err) => handleError(err));
      break;
    // For "Update"
    case response.includes('Update'):
      // Set the employee options in the prompt to be our employees
      findEmployees()
        .then((x) => inquirer.prompt(updateEmployee))
        .then((res) => q.update(res))
        .then((x) => {
          console.log(titles(`Successfully Updated!`));
          init();
        })
        .catch((err) => handleError(err));
      break;
    default:
      process.exit();
  }
}

console.log(titles('Employee Manager'));

function init() {
  inquirer.prompt(menuQ).then((answer) => {
    console.clear();
    handleResponse(answer.menu);
  });
}

init();
