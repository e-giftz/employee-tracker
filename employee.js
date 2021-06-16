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
      'View All Roles',
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
        viewEmployeesByManager();
        break;

      case 'View All Roles':
        viewRoles();
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
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;

    let employeesArray = [] // creating array to hold user entries for employees
    res.forEach(employee => employeesArray.push(employee));
    console.table(employeesArray); // Log all results of the SELECT statement in a table
    readEmployees();
    
    console.log(res);
    //connection.end();
  });
}

const viewEmployeesDept = () => {
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
  let empRole = [];
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) console.log(err);
    for (let i=0; i<roles.length; i++) {
      let roleName = roles[i].title;
      empRole.push(roleName);
    };

    
    let empManager = [];
    connection.query('SELECT * FROM employee', (err, managers) => {
    if (err) console.log(err);
    for (let i=0; i<managers.length; i++) {
      let managerList = managers[i].id;
      empManager.push(managerList);
    }
    // Get information from the user to update databse
    inquirer.prompt([
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
        choices: empRole,
      },
      {
        name: 'manager_Id',
        type: 'list',
        message: 'Select department employee belongs to...',
        choices: empManager,

      }
    ])
      .then((data) => {
        let selectedRole;
        for (let i=0; i<roles.length; i++){
          if (roles[i].title === data.role){
            selectedRole = roles[i];
          }
        };

        let selectedManager;
        for (let i=0; i<managers.length; i++){
          if (managers[i].manager_id === data.manager_Id){
            selectedManager= managers[i];
          }
        };

        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: data.firstName,
            last_name: data.lastName,
            role_id: selectedRole.id,
            manager_id: selectedManager.id
          },
          (err) => {
            if (err) throw err;
            console.log('Updated Employee Roster;');
            readEmployees();
          }
        );
      })
    })
  })
}  

const viewEmployeesByManager = () => {
  const query = 'SELECT * FROM employee ORDER BY manager_id ASC';
  connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
  })

  readEmployees();
}

const updateEmployeeRole = ()  => {
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) console.log(err);
    employees = employees.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      };
    })

    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) console.log(err);
      roles = roles.map((role) => {

        return {
          name: role.title,
          value: role.id,
        }
      });
      inquirer
        .prompt ([
          {
            name: 'selectedEmployee',
            type: 'list',
            message: 'Select employee to update...',
            choices: employees,
          },
          {
            name: 'selectedRole',
            type: 'list',
            message: 'Select the new employee role',
            choices: roles,
          }
        ])
        .then((data) => {
          connection.query('UPDATE employee SET ? WHERE ?',
          [
            {
              role_id: data.selectedRole,
            },
            {
              id: data.selectedEmployee,
            },
          ],
          function (err) {
            if (err) throw err;
          }

          );
          console.log('Employee role updated successfully');
          readEmployees();
        });
      });
  })  
};





