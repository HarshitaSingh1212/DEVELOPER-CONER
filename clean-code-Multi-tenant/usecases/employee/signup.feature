Feature: User Sign Up

  Scenario Outline: It should successfully sign up a new tenant
    Given employee_email: '<employee_email>', employee_password: '<employee_password>', employee_name: '<employee_name>', tenant_name: '<tenant_name>' sign-up
    When try to sign up
    Then It should return the result: '<result>' for sign up

    Examples:
      | employee_email   | employee_password | employee_name | tenant_name     | result                        |
      | ross@example.com | 741852            | neha          | Friends Company | Tenant signed up successfully |

  Scenario Outline: It should throw an error
    Given employee_email: '<employee_email>', employee_password: '<employee_password>', employee_name: '<employee_name>', tenant_name: '<tenant_name>' sign-up
    When try to sign up
    Then It should return the error: '<error>' for sign up

    Examples:
      | employee_email     | employee_password | employee_name | tenant_name     | error                                                                                                                     |
      |                    | 741852            | monica        | Friends Company | Missing required fields. Please provide values for employee_email, employee_password, employee_name, and tenant_fullname. |
      | monica@example.com |                   | monica        | Friends Company | Missing required fields. Please provide values for employee_email, employee_password, employee_name, and tenant_fullname. |
      |                    | 741852            | monica        | Friends Company | Missing required fields. Please provide values for employee_email, employee_password, employee_name, and tenant_fullname. |
      | ross@example.com   | 741852            | monica        |                 | Missing required fields. Please provide values for employee_email, employee_password, employee_name, and tenant_fullname. |
                                                                                                   



