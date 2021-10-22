const inquirer = require('inquirer');
const mysql = require('mysql2');

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
  switch(response){
    case 'View all departments':

      init()
      break;
    case 'View all roles':

      init()
      break;
    case 'View all employees':

      init()
      break;
    case 'Add a department':

      init()
      break;
    case 'Add a role':

      init()
      break;
    case 'Add an employee':

      init()
      break;
    case 'Update an employee role':
      init()
      break;
    default:
      //exit
  }
}

function init() {
  console.log(`
  *******************************
  ********** MAIN MENU **********
  *******************************\n`)
  inquirer.prompt(menuQ)
    .then(answer => handleResponse(answer.menu));
}

init()