Feature: Create Tenant Product

    Scenario Outline: It should successfully create a product for a tenant
        Given employee_id: '<employee_id>' price: '<price>' product_name: '<product_name>' product_type: '<product_type>' product_description: '<product_description>'
        When try to create product
        Then product created result: '<result>'


        Examples:
            | employee_id | price | product_name | product_type | product_description | result                       |
            | 1           | 10.99 | T-shirt      | Clothing     | Comfortable T-shirt | product created successfully |
            | 2           | 29.99 | Backpack     | Accessories  | Spacious Backpack   | product created successfully |

    Scenario: Error while creating a product
        Given employee_id: '<employee_id>' price: '<price>' product_name: '<product_name>' product_type: '<product_type>' product_description: '<product_description>'
        When try to create product
        Then product creation error: '<error>'

        Examples:
            | employee_id | price | product_name | product_type | product_description | error                          |
            | 1           |       | T-shirt      | Clothing     | Comfortable T-shirt | price is required field        |
            | 2           | 29.99 |              | Accessories  | Spacious Backpack   | product name is required field |
            | 1           | 29.99 | Iphone       |              | Spacious Backpack   | product type is required field |
            | 4           | 29.99 | Realme       | Digital      | Spacious Backpack   | invalid token                  |
