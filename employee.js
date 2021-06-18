const mysql = require('mysql');
const inquirer = require('inquirer');

// create connection to sql database
const connection = mysql.createConnection({
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
      'View All Roles',
      'View All Departments',
      'View All Employees By Department',
      'View All Employees By Manager',
      'Add New Employee',
      'Add New Role',
      'Add New Department',
      'Update Existing Employee Role',
      'Remove Employee',
      'Exit',
    ],
  })
    .then((answer) => {
      switch (answer.employeeOptions) {
        case 'View All Employees':
          viewEmployees();
          break;

        case 'View All Roles':
          viewRoles();
          break;

        case 'View All Departments':
          viewDepartments();
          break;

        case 'View All Employees By Department':
          viewEmployeesDept();
          break;

        case 'View All Employees By Manager':
          viewEmployeesByManager();
          break;

        case 'Add New Employee':
          addEmployee();
          break;

        case 'Add New Role':
          addNewRole();
          break;

        case 'Add New Department':
          addNewDept();
          break;

        case 'Remove Employee':
          removeEmployee();
          break;

        case 'Update Existing Employee Role':
          updateEmployeeRole();
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
  });
  readEmployees();
}

const viewRoles = () => {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;

    let roleArray = [];
    res.forEach(role => roleArray.push(role));
    console.table(roleArray); // Log all results of the SELECT statement in a table
  });
  readEmployees();
}

const viewDepartments = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    let departmentArray = [];
    res.forEach(department => departmentArray.push(department));
    console.table(departmentArray);
  })
  readEmployees();
}

const viewEmployeesDept = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    let departmentArray = []
    res.forEach(department => departmentArray.push(department));
    console.table(departmentArray); // Log all results of the SELECT statement in a table
  });
  readEmployees();
}

const viewEmployeesByManager = () => {
  const query = 'SELECT * FROM employee ORDER BY manager_id ASC';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
  });
  readEmployees();
}

const addEmployee = () => {
  let empRole = [];
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) console.log(err);
    for (let i = 0; i < roles.length; i++) {
      let roleName = roles[i].title;
      empRole.push(roleName);
    };


    let empManager = [];
    connection.query('SELECT * FROM employee', (err, managers) => {
      if (err) console.log(err);
      for (let i = 0; i < managers.length; i++) {
        let managerList = managers[i].manager_id;
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
          type: 'rawlist',
          message: 'What is the new employee role...',
          choices: empRole,
        },
        {
          name: 'manager_Id',
          type: 'rawlist',
          message: 'Select a manager which this employee belongs to...',
          choices: empManager,

        }
      ])
        .then((data) => {
          let selectedRole;
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].title === data.role) {
              selectedRole = roles[i];
            }
          };

          let selectedManager;
          for (let i = 0; i < managers.length; i++) {
            if (managers[i].manager_id === data.manager_Id) {
              selectedManager = managers[i];
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
              viewEmployees();
            }
          );
        })
    })
  })
}

const addNewRole = () => {
  connection.query('SELECT * FROM department', (err, depts) => {
    if (err) console.log(err);
    depts = depts.map((department) => {
      return {
        name: department.department_name,
        value: department.id,
      };

    });
    inquirer.prompt([
      {
        name: 'newRole',
        type: 'input',
        message: 'Enter new role  title',
      },
      {
        name: 'newRoleSalary',
        type: 'input',
        message: 'What would be the salary of the role',
      },
      {
        name: 'departmentId',
        type: 'list',
        message: 'What department would the new role be in?',
        choices: depts,
      },
    ])
      .then((data) => {
        connection.query('INSERT INTO role SET ?',
          {
            title: data.newRole,
            salary: data.newRoleSalary,
            department_id: data.departmentId,
          },
          function (err) {
            if (err) throw err;
          }
        );
        console.log('The new employee role has been added successfully!')
        viewRoles();
      });

  });
};

const addNewDept = () => {
  inquirer
    .prompt([
      {
        name: 'newDept',
        type: 'input',
        message: 'Enter name of new  department'
      },
    ])
    .then((data) => {
      connection.query('INSERT INTO department SET ?',
        {
          department_name: data.newDept,
        },
        function (err) {
          if (err) throw err;
          console.log('The new department, ' + data.newDept + ' has been added successfully')
        }
      );
      viewDepartments();
    })

}

const updateEmployeeRole = () => {
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
        .prompt([
          {
            name: 'employeeChoice',
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
                id: data.employeeChoice,
              },
            ],
            function (err) {
              if (err) throw err;
            }
          );
          console.log('Employee role updated successfully');
          viewRoles();
        });
    })
  });

};

const removeEmployee = () => {
  let employeeChoice = [];
  connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", (err, delEmployee) => {
    if (err) throw err;

    for (let i = 0; i < delEmployee.length; i++) {
      let employeeList = delEmployee[i].name;
      employeeChoice.push(employeeList);
    };
    inquirer
      .prompt([
        {
          name: 'employeeId',
          type: 'rawlist',
          message: 'Select employee to be deleted...',
          choices: employeeChoice
        },
      ])
      .then((data) => {
        let selectedEmployee;
        for (let i = 0; i < delEmployee.length; i++) {
          if (delEmployee[i].name === data.employeeId) {
            selectedEmployee = delEmployee[i];
          }
        }
        connection.query('DELETE FROM employee WHERE id=?',
          [selectedEmployee.id],

          function (err) {
            if (err) throw err;
            console.log('The selected  employee has been successfully deleted');
            readEmployees();
          }
        );
      })
  });
}








