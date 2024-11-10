Feature: Set Password of Employee

    Scenario: It should successfully set the password of an employee
        Given set password employee_password: '<employee_password>'
        When try to set password
        Then show the set password result: '<result>'

        Examples:
            | employee_password | result                   |
            | abc@123           | password set successfully |

    Scenario: It should throw an error for unable to set password
        Given set password employee_password: '<employee_password>'
        When try to set password
        Then set error: '<error>'

        Examples:
            | employee_password | error                |
            |                   | password is required |
