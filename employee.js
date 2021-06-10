const mysql = require('mysql');
const inquirer = require('inquirer');

// create connection to sql database
const connection = mysql.createConnection ({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Oge7@ego',
    database: 'employeeTracker_db',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    readEmployees();
});

const readEmployees = () => {

  inquirer.prompt({
    type: 'list',
    name: 'employeeOptions',
    message: "What would you like to do?",
    choices: [
      'View All Employees',
      'View All Employees By Department',
      'View All Employees By Manager',
      'Add Employee',
      'Remove Employee',
      'Update Employee Role',
      'Update Employee Manager',
      'Exit',
    ],
  })
  .then((answer)  => {
    switch (answer.employeeOptions) {
      case 'View All Employees':
        viewEmployees();
        break;

      case 'View All Employees By Department':
        viewEmployeesDept();
        break;

      case 'View All Employees By Manager':
        viewEmployeesManager();
        break;

      case 'Add Employee':
        addEmployee();
        break;

      case 'Remove Employee':
        removeEmployee();
        break;

      case 'Update Employee Role':
        updateEmployeeRole();
        break;

      case 'Update Employee Manager':
        updateEmployeeManager();
        break;

      default:
        console.log("Exiting...")
        connection.end();
        //process.exit();   
    }

  });  
};

// Creating the Choices functions
const viewEmployees = () => {
  connection.query('SELECT id, first_name, last_name, role_id FROM employee', (err, res) => {
    if (err) throw err;

    let employeesArray = [] // creating array to hold user entries for employees
    res.forEach(employee => employeesArray.push(employee));
    console.table(employeesArray); // Log all results of the SELECT statement in a table
    readEmployees();
    
    console.log(res);
    connection.end();
  });
}

const viewDepartment = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    let departmentArray = []
    res.forEach(department => departmentArray.push(department));
    console.table(departmentArray); // Log all results of the SELECT statement in a table
    readEmployees();
  });

}

const viewRoles = () => {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;

    let roleArray = []
    res.forEach(role => roleArray.push(role));
    console.table(roleArray); // Log all results of the SELECT statement in a table
    readEmployees();
  });
}  


const addEmployee = () => {
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) console.log(err);
    roles = roles.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    // Get information from the user to update databse
    inquirer.prompt ([
      {
        name: 'firstName',
        type: 'input',
        message: 'Enter First Name: '
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'Enter Last Name: '
      },
      {
        name: 'role',
        type: 'list',
        message: 'What is the new employee role...',
        choices: roles,
      },
      {

        name: 'manager_Id',
        type: 'list',
        message: 'Select manager id...',
        choices: [1, 2, 3, 4]

      }
    ])
    .then ((data) => {
      console.log(data.role);
      connection.query (
        'INSERT INTO employee SET ?',
        {
          first_name: data.firstname,
          last_name: data.lastname,
          role_id: data.role,
          manager_id: data.managerId
        },
        (err) => {
          if (err) throw err;
          console.log('Updated Employee Roster;');
          viewAllEmployees();
        }
      )
    })
  })  
}



 

    
