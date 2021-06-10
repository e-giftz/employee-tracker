USE employeeTracker_db;

/* Insert 3 Rows into your new table */
INSERT INTO department (name)
VALUES ("IT"), ("Sales"), ("Marketing"), ("Administrative"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Architect", 80000, 1), 
       ("HR Cordinator", 50000, 1),
       ("Cloud Engineer", 100000, 3),
       ("Marketing Manager", 60000, 5),
       ("Accountant", 110000, 2),
       ("Content Manager", 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jessica", "Bell", 1, 4),
       ("Peter", "Dermian", 3, 1),
       ("Titus", "Wander", 2, 1),
       ("Joe", "Wander", 4, 3),
       ("Bob", "Saint", 5, 2);

