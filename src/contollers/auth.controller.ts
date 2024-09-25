import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { LogInRequest } from "../dtos/login.request";
import { SignUpRequest } from "../dtos/signup.request";
import { User } from "../entity/User";
import { EncryptionHelper } from "../helpers/encryption";

const { failed, success, validator } = require("../helpers/response")
export class AuthController {
    static async login(request: Request, response: Response) {
        try {
            const requestBody = plainToClass(LogInRequest, request.body);
            const errors = await validate(requestBody);
            if (errors.length == 0) {
                const currentUser = await AuthController.doesUserExist(requestBody.email);
                const isPasswordValid = await EncryptionHelper.isPasswordValid(currentUser.password, requestBody.password);
                if (!isPasswordValid || !currentUser) {
                    return response.status(400).json(failed("Email/Password incorrect", 400))
                }
                const token = EncryptionHelper.generateJwToken({ id: currentUser.id })
                return response.status(200).json(success("Login successful", { ...currentUser, password: undefined, token }))
            } else {
                return response.status(400).json(failed(errors.toString(), 400))
            }

        } catch (error) {
            return response.status(500).json(failed(error.toString()))
        }
    }

    static async createAccount(request: Request, response: Response) {
        try {
            const requestBody = plainToClass(SignUpRequest, request.body);
            const errors = await validate(requestBody);
            const userRepo = AppDataSource.getRepository(User);
            if (errors.length == 0) {
                const currentUser = await AuthController.doesUserExist(requestBody.email);
                if (currentUser) {
                    return response.status(400).json(failed("User exists"))
                }
                const encrypedPassword = await EncryptionHelper.savePassword(requestBody.password);
                const savedUser = await userRepo.save({ ...requestBody, password: encrypedPassword });
                const token = EncryptionHelper.generateJwToken({ id: savedUser.id })
                return response.status(200).json(success("signup successful", { ...savedUser, password: undefined, token }))
            } else {
                return response.status(400).json(failed(errors.toString()))
            }
        } catch (error) {
            return response.status(500).json(failed(error.toString()))
        }
    }

    static async doesUserExist(email: string): Promise<User | null> {
        const userRepo = AppDataSource.getRepository(User);
        const currentUser = await userRepo.findOne({ where: { email } });
        return currentUser;
    }
}