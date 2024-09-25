import { NextFunction, Request, Response } from "express";
import { AppError, NotFound } from "../helpers/custom_error";
const { extractValidationErrors } = require("../helpers/extract_validation_errors")
const { failed, validation } = require("../helpers/response");
export const ErrorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
    if (Array.isArray(error)) {
        return response.status(422).json(validation(extractValidationErrors(error)))
    }
    if (error instanceof NotFound || error.name === "NotFound") {
        return response.status(404).json(failed("Not Found", 404))
    }
    if (error instanceof AppError) {
        return response.status(400).json(failed(error.message, 400),)
    }

    return response.status(500).json(failed(error.toString(), 500))
}