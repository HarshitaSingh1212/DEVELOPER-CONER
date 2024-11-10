Feature: Update Employee by ID

    Scenario Outline: It should successfully update an employee by ID
        Given update employee_name: '<employee_name>' where employee_id: '<employee_id>'
        When try to update employee by id
        Then It should update the employee fields with result: '<result>'

        Examples:
            | employee_name | employee_id | result              |
            | khushi        | 123456      | updated successfull |
            | mehak         | 789012      | updated successfull |

    Scenario: It should throw an error for an invalid token
        Given update employee_name: '<employee_name>' where employee_id: '<employee_id>'
        When try to update employee by id
        Then updation error: '<error>'

        Examples:
            | employee_name | employee_id | error                   |
            | khushi        |             | employee Id is required |
            | mehak         | 7812        | employee Id not found   |
