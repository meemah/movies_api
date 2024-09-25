import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express-serve-static-core";
import { AppDataSource } from "../data-source";
import { LogInRequest } from "../dtos/login.request";
import { SignUpRequest } from "../dtos/signup.request";
import { User } from "../entity/User";
import { AppError } from "../helpers/custom_error";
import { EncryptionHelper } from "../helpers/encryption";
const { tryCatch } = require("../helpers/try_catch");
const { failed, success, } = require("../helpers/response")

export class AuthController {
    static login =
        tryCatch(async (request: Request, response: Response) => {
            const requestBody = plainToClass(LogInRequest, request.body);
            const errors = await validate(requestBody);
            if (errors.length == 0) {
                const currentUser = await AuthController.doesUserExist(requestBody.email);
                if (!currentUser) {
                    throw new AppError("Email/Password incorrect",)
                }
                const isPasswordValid = await EncryptionHelper.isPasswordValid(currentUser.password, requestBody.password);
                if (!isPasswordValid) {
                    throw new AppError("Email/Password incorrect",)
                }
                const token = EncryptionHelper.generateJwToken({ id: currentUser.id })
                return response.status(200).json(success("Login successful", { ...currentUser, password: undefined, token }))
            } else {
                throw errors;
            }
        }
        );


    static createAccount =
        tryCatch(async (request: Request, response: Response) => {
            const requestBody = plainToClass(SignUpRequest, request.body);
            const errors = await validate(requestBody);
            const userRepo = AppDataSource.getRepository(User);
            if (errors.length == 0) {
                const currentUser = await AuthController.doesUserExist(requestBody.email);
                if (currentUser) {
                    throw new AppError("User Exists")
                }
                const encrypedPassword = await EncryptionHelper.savePassword(requestBody.password);
                const savedUser = await userRepo.save({ ...requestBody, password: encrypedPassword });
                const token = EncryptionHelper.generateJwToken({ id: savedUser.id })
                return response.status(200).json(success("signup successful", { ...savedUser, password: undefined, token }))
            } else {
                throw errors;
            }
        }
        )



    static async doesUserExist(email: string): Promise<User | null> {
        const userRepo = AppDataSource.getRepository(User);
        const currentUser = await userRepo.findOne({ where: { email } });
        return currentUser;
    }
}