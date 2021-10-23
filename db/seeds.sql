USE company_db;

INSERT INTO departments (department)
VALUES
  ("Development"),
  ("Marketing");

INSERT INTO roles (role, salary, department_id)
VALUES
  ("Development Manager", 120000, 1),
  ("Front End Engineer", 60000, 1),
  ("Back End Engineer", 80000, 1),
  ("UI UX Designer", 75000, 1),
  ("Marketing Manager", 75000, 2),
  ("Marketing Slave", 20, 2);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
  ("John", "Manson", 1),
  ("Jack", "Johnson", 2),
  ("Jinky", "Janky", 2),
  ("Mark", "Wilkinson", 3),
  ("Billy", "Addams", 4),
  ("Jamie", "Lamie", 5),
  ("Oscar", "Grouch", 6);