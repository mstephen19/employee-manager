const inquirer = require('inquirer');
const q = require('./lib/dbLogic');

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
  if (response.includes('View')){
    q.view(response);
    init();
  } else if (response.includes('Add')){
    q.add(response);
    init();
  } else {
    q.update(response);
    init();
  }
}

function init() {
  console.log(`
  **************************************
  ********** Employee Manager **********
  **************************************\n`)
  inquirer.prompt(menuQ)
    .then(answer => handleResponse(answer.menu));
}

init()