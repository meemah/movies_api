import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const { jwtSecret } = require("../helpers/config");
const { failed } = require("../helpers/response")

const authorizationMiddleware = (request: Request, response: Response, nextFunction: NextFunction) => {
    try {
        const token: string = request.headers.authorization?.split(" ")[0];
        const decodedToken = jwt.verify(token, jwtSecret)
        request.body.user = decodedToken;
        nextFunction()
    } catch (error) {
        return response.status(401).json(failed(
            "Unauthorized"
        ),);
    }
}