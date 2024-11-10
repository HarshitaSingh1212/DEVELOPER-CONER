Feature: Delete Employee by ID

    Scenario Outline: It should successfully delete an employee by ID
        Given a valid employee_id: '<employee_id>'
        When try to delete employee
        Then It should delete the employee and show the result: '<result>'

        Examples:
            | employee_id | result                       |
            | 123456      | employee deleted successfull |
            | 789012      | employee deleted successfull |

    Scenario: delete employee if error throw error
        Given  a valid employee_id: '<employee_id>'
        When try to delete employee
        Then It should throw deleting error: '<error>'
        Examples:
            | employee_id | error                               |
            | 122         | employee Id not found                |
            | 123         | permission denied for this operation |

