Feature: delete Tenant Product

    Scenario Outline: It should successfully delete a product for a tenant
        Given product_id: '<product_id>'
        When try to delete product
        Then product deleted result: '<result>'


        Examples:
            | product_id | result                       |
            | 1          | product deleted successfully |
            | 2          | product deleted successfully |

    Scenario: Error while deleting a product
        Given product_id: '<product_id>'
        When try to delete product
        Then product deleting error: '<error>'

        Examples:
            | product_id | error                  |
            |            | product Id is required |
            | 3          | product not found      |
