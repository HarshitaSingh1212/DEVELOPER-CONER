Feature: Create Tenant Channel

    Scenario Outline: It should successfully create a channel for a tenant
        Given channel_name: '<channel_name>' channel_code: '<channel_code>'
        When try to create channel
        Then successful creation result: '<result>'

        Examples:
            | channel_name | channel_code | result                       |
            | General      | GEN          | channel created successfully |
            | Announcement | ANN          | channel created successfully |

    Scenario: It should throw an error for an invalid token
        Given channel_name: '<channel_name>' channel_code: '<channel_code>'
        When try to create channel
        Then channel creation error: '<error>'

        Examples:
            | channel_name | channel_code | error                          |
            | General      |              | channel_code is required field |
            |              | ANN          | channel_name is required field |