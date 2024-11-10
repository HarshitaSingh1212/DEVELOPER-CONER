Feature: read all Tenant Product

    Scenario Outline: It should successfully read all a product for a tenant
        Given reader employee_id: '<employee_id>'
        When try to read all product
        Then product read all result: '<result>'


        Examples:
            | employee_id | result          |
            | 1           | list of product |
            | 2           | list of product |

    Scenario: Error while reading all product
        Given reader employee_id: '<employee_id>'
        When try to read all product
        Then all product reading error: '<error>'

        Examples:
            | employee_id | error         |
            |             | invalid token |

