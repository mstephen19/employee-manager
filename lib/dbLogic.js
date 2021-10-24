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
    switch(toShow){
      case "departments":
        info = await query('SELECT * FROM departments');
        break;
      case "roles":
        info = await query('SELECT roles.id, roles.role, roles.salary, departments.department FROM roles INNER JOIN departments ON departments.id = roles.department_id;');
        break;
      case "employees":
        // THIS IS NOT MEETING ALL THE MINIMUM REQUIREMENTS
        info = await query('SELECT employees.id, employees.first_name, employees.last_name, roles.role, roles.salary FROM employees INNER JOIN roles ON roles.id = employees.role_id;');
        break;
    }
    return info;
  },
  add: async function(response, data) {
    const toAddTo = `${response.split(' ')[2]}s`;
    let res;
    switch(toAddTo){
      case "departments":
        res = await query('INSERT INTO departments (department) VALUES (?)', data.dept_name)
        break;
      case "roles":
        res = await query('SELECT * FROM departments WHERE department = ?', data.dept)
          .then(res => query('INSERT INTO roles (role, salary, department_id, manager) VALUES (?, ?, ?, ?)', [data.role_name, data.salary, res[0].id, data.manager]))
        break;
      case "employees":
      const promises = [query('SELECT * FROM roles WHERE role = ?', data.role_name), query('SELECT * FROM employees WHERE first_name = ? AND last_name = ?', [data.manager_name.split(' ')[0], data.manager_name.split(' ')[1]])]
      res = await Promise.all(promises)
        .then(info => {
          query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.first_name, data.last_name, info[0][0].id, info[1][0].id])
      })
        break;
    }
    return res;
  },
  update: function(data) {

  }
};

// where the employee's role is, join on employee name where roles.manager = 1