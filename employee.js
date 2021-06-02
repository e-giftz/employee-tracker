const mysql = require('mysql');
const inquirer = require('inquirer');

// create connection to sql database
const connection = mysql.createConnection ({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: employeeTracker_db,
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    readEmployees();
  });
const readEmployees = () => {
    inquirer.prompt({
        
    })
    
    
    connection.query('SELECT name FROM colleges', (err, res) => {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    });
  };