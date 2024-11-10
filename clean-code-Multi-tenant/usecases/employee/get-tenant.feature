Feature: Get Tenant Employee Password

    Scenario Outline: It should successfully get the tenant employee password
        Given a valid tenant_id: '<tenant_id>'
        When try to get the tenant employee password with tenant_id
        Then It should return result: '<result>'

        Examples:
            | tenant_id | result                                 |
            | 1         | enter password for the given tenant_id |
            | 2         | enter password for the given tenant_id |

    Scenario: It should throw an error
        Given a valid tenant_id: '<tenant_id>'
        When try to get the tenant employee password with tenant_id
        Then It should return the error: '<error>'
        Examples:
            | tenant_id | error                |
            |           | tenant id is required |
            | 3         | tenant ID not found  |
