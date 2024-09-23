
exports.success = (message: string, data: any, statusCode: Number) => {
    return {
        "success": true,
        "code": statusCode,
        message,
        data
    };
}

exports.failed = (message: string, statusCode: Number) => {
    return {
        "success": false,
        "code": statusCode,
        "message": message,
    };
}

exports.validation = (validationErrors) => {
    return {
        "success": false,
        "code": 422,
        "message": validationErrors,
    };
}