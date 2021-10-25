const mysql = require('mysql2');
const util = require('util');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'company_db',
});

const query = util.promisify(db.query).bind(db);

const getInfo = async (input) => {
  const allRoles = await query('SELECT id, role FROM roles');
  const allDepts = await query('SELECT id, department FROM departments');
  const allEmps = await query('SELECT * FROM employees');
  const change = async function (input) {
    await input.forEach((obj) => {
      for (let i = 0; i < allRoles.length; i++) {
        if (obj.role === allRoles[i].id) {
          obj.role = allRoles[i].role;
        }
      }
    });
    await input.forEach((obj) => {
      for (let i = 0; i < allDepts.length; i++) {
        if (obj.department === allDepts[i].id) {
          obj.department = allDepts[i].department;
        }
      }
    });
    await input.forEach((obj) => {
      for (let i = 0; i < allEmps.length; i++) {
        if (obj.manager === allEmps[i].id) {
          obj.manager = `${allEmps[i].first_name} ${allEmps[i].last_name}`;
        }
      }
    });
    return input;
  };
  return change(input);
};

module.exports = {
  view: async function (response) {
    const toShow = response.split(' ')[2];
    let info;
    switch (toShow) {
      case 'departments':
        info = await query('SELECT * FROM departments');
        break;
      case 'roles':
        info = await query(
          'SELECT roles.id, roles.role, roles.salary, departments.department FROM roles INNER JOIN departments ON departments.id = roles.department_id;'
        );
        break;
      case 'employees':
        // THIS IS NOT MEETING ALL THE MINIMUM REQUIREMENTS
        const incomplete = await query(
          'SELECT employees.id, employees.first_name, employees.last_name, employees.role_id AS role, roles.department_id AS department, roles.salary, employees.manager_id AS manager FROM employees JOIN roles WHERE employees.role_id = roles.id ORDER BY employees.id'
        );
        info = await getInfo(incomplete);
        break;
    }
    return info;
  },
  add: async function (response, data) {
    const toAddTo = `${response.split(' ')[2]}s`;
    let res;
    switch (toAddTo) {
      case 'departments':
        res = await query(
          'INSERT INTO departments (department) VALUES (?)',
          data.dept_name
        );
        break;
      case 'roles':
        res = await query(
          'SELECT * FROM departments WHERE department = ?',
          data.dept
        ).then((res) =>
          query(
            'INSERT INTO roles (role, salary, department_id, manager) VALUES (?, ?, ?, ?)',
            [data.role_name, data.salary, res[0].id, data.manager]
          )
        );
        break;
      case 'employees':
        const promises = [
          query('SELECT * FROM roles WHERE role = ?', data.role_name),
          query(
            'SELECT * FROM employees WHERE first_name = ? AND last_name = ?',
            [data.manager_name.split(' ')[0], data.manager_name.split(' ')[1]]
          ),
        ];
        res = await Promise.all(promises).then((info) => {
          query(
            'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [data.first_name, data.last_name, info[0][0].id, info[1][0].id]
          );
        });
        break;
    }
    return res;
  },
  update: async function (data) {
    const res = await query(
      'SELECT * FROM roles WHERE role = ?',
      data.new_role
    ).then((roleInfo) =>
      query(
        'UPDATE employees SET role_id = ? WHERE first_name = ? AND last_name = ?',
        [
          roleInfo[0].id,
          data.employee_name.split(' ')[0],
          data.employee_name.split(' ')[1],
        ]
      )
    );
    return res;
  },
  employeeNameArray: async function () {
    const employeeArr = [];
    const employees = await query(
      'SELECT first_name, last_name FROM employees'
    );
    for (obj of employees) {
      employeeArr.push(`${obj.first_name} ${obj.last_name}`);
    }
    return employeeArr;
  },
};
