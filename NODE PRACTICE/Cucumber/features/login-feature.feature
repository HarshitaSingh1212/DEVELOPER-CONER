Feature: User Page Functionality

  Scenario: User Signup
    Given the database file does not exist
    When I sign up with username "harshita" and password "hey1"
    Then I should receive "Congratulations! Sign up complete"

  Scenario: User Login with Correct Credentials
    Given the database file exists
    When I login with username "harshita" and password "hey1"
    Then I should receive "Welcome harshita"

  Scenario: User Login with Incorrect Password
    Given the database file exists
    When I login with username "harshita" and incorrect password "hey2"
    Then I should receive "login fail! check your password"

  Scenario: User Signup with Existing Username
    Given the database file exists
    When I sign up with existing username "poorva" and password "hey2"
    Then I should receive "user already exist"

