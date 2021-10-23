const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'company_db'
  }
);

module.exports = {
  view: function(response) {
    let toShow = response.split(' ')[2];
    //We want to show 
  },
  add: function(data) {

  },
  update: function(data) {

  }
};