Feature: Read All Tenant Channels

    Scenario: It should successfully update channel 
        Given update channel by channel_id:'<channel_id>' tenant_id: '<tenant_id>'
        When try to update channels
        Then It should return the update message in result: '<result>'


        Examples:
            | channel_id | tenant_id | result           |
            | 1          | 1233      | channel updated successfully |
            | 2          | 1124      | channel updated successfully |

    Scenario:Error in updating channel 
        Given update channel by channel_id:'<channel_id>' tenant_id: '<tenant_id>'
        When try to update channels
        Then channel updating error: '<error>'

        Examples:
            | channel_id | tenant_id | error                |
            | 1          |           | invalid token        |
            | 3          | 21333     | channel id not found |