const error_constants = {
    ROUTE_NOT_FOUND: 'Route not available',
    INTERNAL_SERVER_ERROR: "Internal server error",
    INVALID_DATA_FORMAT: "Server cannot interepret provided data.",
    INVALID_CREDENTIAL: "Invalid credential provided.", 
    DATA_NOT_FOUND: "You have provided invalid user data.",
    DATA_ALREADY_EXISTS: "Data already exist.",
    INVALID_EMAIL: "Invalid email provided.",
    INVALID_PASSWORD: "Password must be 4 chars long.",
    INVALID_TOKEN: "Invalid token provided."
}

const success_constants = {
    DATA_CREATED: 'Data created successfully.',
    DATA_FOUND: 'Data found successfully.',
    DATA_UPDATED: 'Data updated successfully.',
    DATA_DELETED: 'Data deleted successfullly.',
    NEW_SESSION: 'NEW_SESSION_CREATED',
    MERGED_SESSION: 'MERGED_WITH_LAST_SESSION'
}

module.exports = {
    error_constants, success_constants
}
