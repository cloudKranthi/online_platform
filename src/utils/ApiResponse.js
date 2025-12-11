
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; // True for status codes like 200, 201, 202
    }
}

// Export the standard response class
module.exports = ApiResponse;