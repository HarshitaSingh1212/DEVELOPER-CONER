Feature: Employee Login

  Scenario Outline: It should successfully login an employee
    Given employee_email: '<employee_email>' login
    When try to login
    Then It should successfully login result: '<result>'

    Examples:
      | employee_email     | result       |
      | ross@example.com   | tenant_id :1 |
      | monica@example.com | tenant_id :1 |

  Scenario Outline: It should throw an error
    Given employee_email: '<employee_email>' login
    When try to login
    Then It should return the error: '<error>' for login

    Examples:
      | employee_email          | error                   |
      | invalid@example.com     | invalid email           |
      | nonexisting@example.com | invalid email           |
      |                         | email is required field |

