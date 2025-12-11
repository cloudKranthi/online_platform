
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        // Call the parent (Error) constructor
        super(message);

        // Custom properties for API errors
        this.statusCode = statusCode;
        this.data = null; // Used to hold data that might accompany the error
        this.message = message;
        this.success = false; // Always false for an error response
        this.errors = errors; // Array to hold more detailed validation errors, etc.

        // Capture stack trace, unless a specific one is provided
        if (stack) {
            this.stack = stack;
        } else {
            // Error.captureStackTrace makes sure the error points to where it was thrown
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the custom error class
module.exports = ApiError;