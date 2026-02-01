class ApiResponse {
    success: boolean
    statusCode: number
    message: string
    data: unknown

    constructor(
        data: unknown,
        message = "Fetched resource",
        statusCode = 200,
    ) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data
    }
}

export default ApiResponse;