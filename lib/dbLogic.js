const { left } = require('inquirer/lib/utils/readline');
const mysql = require('mysql2');
const util = require('util');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'company_db'
  }
);

const query = util.promisify(db.query).bind(db);

module.exports = {
  view: async function(response) {
    const toShow = response.split(' ')[2];
    let info;
    switch(true){
      case toShow === "departments":
        info = await query('SELECT * FROM departments');
        break;
      case toShow === "roles":
        info = await query('SELECT roles.id, roles.role, roles.salary, departments.department FROM roles INNER JOIN departments ON departments.id = roles.department_id;');
        break;
      case toShow === "employees":
        // THIS IS NOT MEETING ALL THE MINIMUM REQUIREMENTS
        info = await query('SELECT employees.id, employees.first_name, employees.last_name, roles.role, roles.salary FROM employees INNER JOIN roles ON roles.id = employees.role_id;');
        break;
    }
    return info;
  },
  add: function(data) {

  },
  update: function(data) {

  }
};

// where the employee's role is, join on employee name where roles.manager = 1