import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DirectorRequest } from "../dtos/director.request";
import { Cast } from "../entity/Cast.entity";
import { Director } from "../entity/Director.entity";
const { failed, success, validator } = require("../helpers/response")
export class CastController {
    static async getAllCast(request: Request, response: Response) {
        try {
            const castRepo = AppDataSource.getRepository(Cast);
            const casts: Cast[] = await castRepo.find();
            return response.status(200).json(success("Cast fetched sucessfully", casts))
        } catch (error) {
            return response.status(500).json(failed(error.toString(),))
        }
    }

    static async addCast(request: Request, response: Response) {
        try {
            const castRepo = AppDataSource.getRepository(Cast);
            const requestBody = plainToClass(DirectorRequest, request.body);
            const errors = await validate(requestBody);
            if (errors.length == 0) {
                const doesDirectorExist = await CastController.doesCastExist(requestBody.name) !== null;
                if (doesDirectorExist) {
                    return response.status(400).json(failed("Cast exists"))
                }
                const director = await castRepo.save(requestBody);
                return response.status(200).json(success(`${requestBody.name} added`))
            } else {
                return response.status(400).json(failed(errors.toString()))
            }
        } catch (error) {
            return response.status(500).json(failed(error.toString(),))
        }
    }
    static async updateCast(request: Request, response: Response) {
        try {
            const directorId = request.params.id;
            const castRepo = AppDataSource.getRepository(Cast);
            const selectedCast = await castRepo.findOne({ where: { id: directorId } })
            if (!selectedCast) {
                return response.status(400).json(failed("Cast doesnt exist"));
            }
            castRepo.merge(selectedCast, request.body);
            await castRepo.save(selectedCast);
            return response.status(200).json(success("Cast updated"));
        } catch (error) {
            return response.status(500).json(failed(error.toString(),));
        }
    }

    static async doesCastExist(name: string): Promise<Director | null> {
        const castRepo = AppDataSource.getRepository(Cast);
        const cast: Cast | null = await castRepo.findOne({ where: { name: name } });
        return cast;
    }
}