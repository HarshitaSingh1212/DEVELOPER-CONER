Feature: Read All Tenant Channels

    Scenario: It should successfully read single channels for a tenant
        Given read single channel by channel_id:'<channel_id>' tenant_id: '<tenant_id>'
        When try to read single channels
        Then It should return the single channels in result: '<result>'


        Examples:
            | channel_id | tenant_id | result           |
            | 1          | 1233      | list of channels |
            | 2          | i124      | list of channels |

    Scenario:Error in single channel reading
        Given read single channel by channel_id:'<channel_id>' tenant_id: '<tenant_id>'
        When try to read single channels
        Then single channel reading error: '<error>'

        Examples:
            | channel_id | tenant_id | error                |
            | 1          |           | invalid token        |
            | 3          | 21333     | channel id not found |