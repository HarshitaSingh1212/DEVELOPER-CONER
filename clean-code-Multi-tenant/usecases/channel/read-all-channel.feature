Feature: Read All Tenant Channels

    Scenario: It should successfully read all channels for a tenant
        Given read channel tenant_id: '<tenant_id>'
        When try to read all channels
        Then It should return the list of channels in result: '<result>'


        Examples:
            | tenant_id | result           |
            | 1233      | list of channels |
            | i124      | list of channels |

    Scenario:Error in reading channel
        Given read channel tenant_id: '<tenant_id>'
        When try to read all channels
        Then channel reading error: '<error>'

        Examples:
            | tenant_id | error         |
            |           | invalid token |
