const inquirer = require('inquirer');
const q = require('./lib/dbLogic');
// Better console.table()
const cTable = require('console.table');
// Easily create a fancy title in console. Small helper function
const titles = require('./lib/titles');

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
      'Exit'
    ],
    message: 'Menu Options',
    required: 'true',
  },
];

const addDept = [
  {
    name: 'dept_name',
    message: 'What is the name of the department?',
    required: 'true'
  }
]

const addRole = [
  {
    name: 'role_name',
    message: 'What is the name of this role?',
    required: 'true'
  },
  {
    name: 'salary',
    message: 'What is this role\'s salary?',
    required: 'true'
  },
  {
    name: 'dept',
    message: 'What is the name of the department of this role?',
    required: 'true'
  },
  {
    name: 'manager',
    type: 'list',
    choices: ['Yes', 'No'],
    message: 'Is this a manager role?',
    required: 'true'
  }
]

const addEmployee = [
  {
    name: 'first_name',
    message: 'What is this employee\'s first name?',
    required: 'true'
  },
  {
    name: 'last_name',
    message: 'How about their last name?',
    required: 'true'
  },
  {
    name: 'role_name',
    message: 'What is the name of their role?',
    required: 'true'
  },
  {
    name: 'manager_name',
    message: 'What is their manager\'s first name?',
    required: 'true'
  }
]

function handleResponse(response){
  switch(true){
    // For "View"
    case response.includes('View'):
      // Run the view() function
      q.view(response)
        .then(info => {
          console.table(info)
          init();
        })
        .catch(err => console.error(err));
      break;
    // For "Add"
    case response.includes('Add'):
      let toPrompt;
      // Set the prompt questions to funnel into inquirer.prompt()
      switch (true){
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
        inquirer.prompt(toPrompt)
        // Send the menu option + the prompt data to the add() function
          .then(res => {
            // Setting the manager option to a boolean value which will be used in add() function
            res.manager === 'Yes' ? res.manager = true : res.manager = false;
            q.add(response, res)
          })
          .then(x => {
            console.log(titles(`${response.split(' ')[2].charAt(0).toUpperCase() + response.split(' ')[2].slice(1)} Added!`))
            init()
          })
          .catch(err=>console.error(err));
      break;
    // For "Update"
    case response.includes('Update'):
      //Same here
      q.update(response);
      init();
      break;
    default:
      process.exit();
  }
};

console.log(titles('Employee Manager'))

function init() {
  inquirer.prompt(menuQ)
    .then(answer => {
      console.clear();
      handleResponse(answer.menu);
    });
}

init()