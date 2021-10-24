const inquirer = require('inquirer');
const q = require('./lib/dbLogic');
const cTable = require('console.table')

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

function handleResponse(response){
  switch(true){
    // For "View"
    case response.includes('View'):
      q.view(response)
        .then(info => {
          console.table(info)
          init();
        })
        .catch(err => console.error(err));
      break;
    // For "Add"
    case response.includes('Add'):
      q.add(response);
      init();
      break;
    // For "Update"
    case response.includes('Update'):
      q.update(response);
      init();
      break;
    default:
      process.exit();
  }
};

function init() {
  console.log(`
  **************************************
  ********** Employee Manager **********
  **************************************\n`)
  inquirer.prompt(menuQ)
    .then(answer => {
      handleResponse(answer.menu);
      console.clear();
    });
}

init()