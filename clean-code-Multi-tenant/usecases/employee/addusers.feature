Feature: Add Users as Employee

    Scenario Outline: It should successfully add a user as an employee
        Given employee_email: '<employee_email>' employee_name: '<employee_name>'
        When try to add user as employee
        Then employee added result: '<result>'

        Examples:
            | employee_email     | employee_name | result                     |
            | ross@example.com   | Ross Geller   | employee added successfull |
            | monica@example.com | Monica Geller | employee added successfull |

    Scenario: It should throw an error if error in adding user
        Given employee_email: '<employee_email>' employee_name: '<employee_name>'
        When try to add user as employee
        Then error in adding user error: '<error>'

        Examples:
            | employee_email       | employee_name | error              |
            | existing@example.com | riss          | user already exist |


