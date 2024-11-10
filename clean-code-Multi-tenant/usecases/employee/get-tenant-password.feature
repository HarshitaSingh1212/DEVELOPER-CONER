Feature: Get Employee Password

    Scenario Outline: It should successfully get the employee password
        Given a valid employee_password: '<employee_password>'
        When validate employee password
        Then It should generate login result: '<result>'

        Examples:
            | employee_password | result                        |
            | abc123            | welcome! login is successfull |

    Scenario: It should throw an error for an invalid token
        Given a valid employee_password: '<employee_password>'
        When validate employee password
        Then It should throw the error: '<error>'

        Examples:
            | employee_password | error                     |
            | ab                | invalid email or password |
            |                   | password is required      |



