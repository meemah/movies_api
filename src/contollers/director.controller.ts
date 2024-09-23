import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DirectorRequest } from "../dtos/director.request";
import { Director } from "../entity/Director.entity";
const { failed, success, validator } = require("../helpers/response")
export class DirectorController {

    static async getAllDirectors(request: Request, response: Response) {
        try {
            const directorRepo = AppDataSource.getRepository(Director);
            const directors: Director[] = await directorRepo.find();
            return response.status(200).json(success("Directors fetched sucessfully", directors))
        } catch (error) {
            return response.status(500).json(failed(error.toString(),))
        }
    }

    static async addDirector(request: Request, response: Response) {
        try {
            const directorRepo = AppDataSource.getRepository(Director);
            const requestBody = plainToClass(DirectorRequest, request.body);
            const errors = await validate(requestBody);
            if (errors.length == 0) {
                const doesDirectorExist = await DirectorController.doesDirectorExist(requestBody.name) !== null;
                if (doesDirectorExist) {
                    return response.status(400).json(failed("Director exists"))
                }
                const director = await directorRepo.save(requestBody);
                return response.status(200).json(success(`${requestBody.name} added`))
            } else {
                return response.status(400).json(failed(errors.toString()))
            }
        } catch (error) {
            return response.status(500).json(failed(error.toString(),))
        }
    }
    static async updateDirector(request: Request, response: Response) {
        try {
            const directorId = request.params.id;
            const directorRepo = AppDataSource.getRepository(Director);
            const selectedDirector = await directorRepo.findOne({ where: { id: directorId } })
            if (!selectedDirector) {
                return response.status(400).json(failed("Director doesnt exist"));
            }
            directorRepo.merge(selectedDirector, request.body);
            await directorRepo.save(selectedDirector);
            return response.status(200).json(success("Director updated"));
        } catch (error) {
            return response.status(500).json(failed(error.toString(),));
        }
    }

    static async doesDirectorExist(name: string): Promise<Director | null> {
        const directorRepo = AppDataSource.getRepository(Director);
        const director: Director | null = await directorRepo.findOne({ where: { name: name } });
        return director;
    }
}