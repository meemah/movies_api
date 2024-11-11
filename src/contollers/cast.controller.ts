import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Response } from "express";
import { Request } from "express-serve-static-core";
import { AppDataSource } from "../data-source";
import { DirectorRequest } from "../dtos/director.request";
import { Cast } from "../entity/Cast.entity";
import { Director } from "../entity/Director.entity";
import { AppError, NotFound } from "../helpers/custom_error";
const { success, } = require("../helpers/response")
const { tryCatch } = require("../helpers/try_catch");

export class CastController {
    static getAllCast = tryCatch(async (_: Request, response: Response) => {
        const castRepo = AppDataSource.getRepository(Cast);
        const casts: Cast[] = await castRepo.find();
        return response.status(200).json(success("Cast fetched sucessfully", casts))

    });


    static addCast = tryCatch(async (request: Request, response: Response) => {
        const castRepo = AppDataSource.getRepository(Cast);
        const requestBody = plainToClass(DirectorRequest, request.body);
        const errors = await validate(requestBody);
        if (errors.length == 0) {
            const doesDirectorExist = await CastController.doesCastExist(requestBody.name) !== null;
            if (doesDirectorExist) {
                throw new AppError("Cast Exists")
            }
            await castRepo.save(requestBody);
            return response.status(200).json(success(`${requestBody.name} added`, requestBody))
        } else {
            throw errors;
        }
    });


    static updateCast = tryCatch(async (request: Request, response: Response) => {
        const directorId = request.params.id;
        const castRepo = AppDataSource.getRepository(Cast);
        const selectedCast = await castRepo.findOne({ where: { id: directorId } })
        if (!selectedCast) {
            throw new NotFound("Cast Exists",)
        }
        castRepo.merge(selectedCast, request.body);
        await castRepo.save(selectedCast);
        return response.status(200).json(success("Cast updated", selectedCast));
    });


    static async doesCastExist(name: string): Promise<Director | null> {
        const castRepo = AppDataSource.getRepository(Cast);
        const cast: Cast | null = await castRepo.findOne({ where: { name: name } });
        return cast;
    }
}