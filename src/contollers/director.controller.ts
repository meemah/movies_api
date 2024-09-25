import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DirectorRequest } from "../dtos/director.request";
import { Director } from "../entity/Director.entity";
import { AppError, NotFound } from "../helpers/custom_error";
const { success } = require("../helpers/response");
const { tryCatch } = require("../helpers/try_catch");
export class DirectorController {
    static getAllDirectors = tryCatch(async (request: Request, response: Response) => {
        const directorRepo = AppDataSource.getRepository(Director);
        const directors: Director[] = await directorRepo.find();
        return response.status(200).json(success("Directors fetched sucessfully", directors))
    })

    static addDirector = tryCatch(async (request: Request, response: Response) => {
        const directorRepo = AppDataSource.getRepository(Director);
        const requestBody = plainToClass(DirectorRequest, request.body);
        const errors = await validate(requestBody);
        if (errors.length == 0) {
            const doesDirectorExist = await DirectorController.doesDirectorExist(requestBody.name) !== null;
            if (doesDirectorExist) {
                throw new AppError("Director exists")
            }
            await directorRepo.save(requestBody);
            return response.status(200).json(success(`${requestBody.name} added`))
        } else {
            throw errors;
        }
    });
    static updateDirector = tryCatch(async (request: Request, response: Response) => {
        const directorId = request.params.id;
        const directorRepo = AppDataSource.getRepository(Director);
        const selectedDirector = await directorRepo.findOne({ where: { id: directorId } })
        if (!selectedDirector) {
            throw new NotFound("Director exists")
        }
        directorRepo.merge(selectedDirector, request.body);
        await directorRepo.save(selectedDirector);
        return response.status(200).json(success("Director updated"));

    });

    static async doesDirectorExist(name: string): Promise<Director | null> {
        const directorRepo = AppDataSource.getRepository(Director);
        const director: Director | null = await directorRepo.findOne({ where: { name: name } });
        return director;
    }
}