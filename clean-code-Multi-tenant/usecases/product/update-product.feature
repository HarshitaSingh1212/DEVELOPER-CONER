Feature: Update Tenant Product

    Scenario Outline: It should successfully update a product for a tenant
        Given update product_id: '<product_id>' price: '<price>' product_name: '<product_name>' product_type: '<product_type>' product_description: '<product_description>'
        When try to update product
        Then It should update product data and show result: '<result>'

        Examples:
            | product_id | price | product_name | product_type | product_description | result                       |
            | 1          | 10.99 | T-shirt      | Clothing     | Comfortable T-shirt | product updated successfully |
            | 2          | 29.99 | Backpack     | Accessories  | Spacious Backpack   | product updated successfully |

    Scenario: Error while updating product
        Given update product_id: '<product_id>' price: '<price>' product_name: '<product_name>' product_type: '<product_type>' product_description: '<product_description>'
        When try to update product
        Then product updation error: '<error>'


        Examples:
            | product_id | price | product_name | product_type | product_description | error                       |
            | 3          | 10.99 | T-shirt      | Clothing     | Comfortable T-shirt | product not found |
            |            | 29.99 | Backpack     | Accessories  | Spacious Backpack   |  product not found |