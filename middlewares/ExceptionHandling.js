// Custom error classes (similar to CheckNoutValidationException, Fx2sException in .NET)
export class ValidationException extends Error {
    constructor(message, errors = []) {
        super(message);
        this.name = 'ValidationException';
        this.statusCode = 400;
        this.errors = errors;
    }
}

export class Fx2sException extends Error {
    constructor(message, errors = []) {
        super(message);
        this.name = 'Fx2sException';
        this.statusCode = 400;
        this.errors = errors;
    }
}

// Error response format (like your ErrorResponse in .NET)
const createErrorResponse = (status, message, errors) => ({
    status,
    message,
    errors
});

// Middleware function (Express style)
export const exceptionHandlingMiddleware = (err, req, res, next) => {
    console.error(err); // Similar to _logger.LogError()

    res.setHeader('Content-Type', 'application/json');

    if (err instanceof ValidationException) {
        res.status(400).json(createErrorResponse(400, err.message, err.errors));
    }
    else if (err instanceof Fx2sException) {
        res.status(400).json(createErrorResponse(400, err.message, err.errors));
    }
    else {
        const message = err.message || 'Internal Server Error';
        res.status(err.statusCode || 500).json(createErrorResponse(500, message, [message]));
    }
};

