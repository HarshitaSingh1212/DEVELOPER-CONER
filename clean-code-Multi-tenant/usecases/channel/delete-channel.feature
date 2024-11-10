Feature: Delete Tenant Channel

    Scenario Outline: It should successfully delete a channel for a tenant
        Given channel_id: '<channel_id>'
        When try to delete channel by ID
        Then channel deleted result: '<result>'

        Examples:
            | channel_id | result                       |
            | 123456     | channel deleted successfully |
            | 789012     | channel deleted successfully |

    # Scenario: Error while deleting channel
    #     Given channel_id: '<channel_id>'
    #     When try to delete channel by ID
    #     Then channel deletion error: '<error>'


    #         | channel_id | error                 |
    #         | 1234777       | channel not found      |
    #         |            | channel id is required |