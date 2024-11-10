Feature: read Tenant Product by ID

    Scenario Outline: It should successfully read product by ID for a tenant
        Given employee_id: '<employee_id>' and product_id: '<product_id>'
        When try to read product by ID
        Then product read by id result: '<result>'


        Examples:
            | employee_id | product_id | result          |
            | 1           | 123        | list of product |
            | 2           | 124        | list of product |

    Scenario: Error while reading product by ID
        Given  employee_id: '<employee_id>' and product_id: '<product_id>'
        When try to read product by ID
        Then product reading by id error: '<error>'

        Examples:
            | employee_id | product_id | error             |
            |             | 123        | invalid token     |
            | 1           | 111        | product not found |