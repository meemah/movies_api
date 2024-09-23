import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { StudioRequest } from "../dtos/studio.request";
import { Studio } from "../entity/Studio.entity";
const { failed, success, validator } = require("../helpers/response")
export class StudioController {
    static async getStudios(request: Request, response: Response) {
        try {
            const studioRepo = AppDataSource.getRepository(Studio)
            const sudios: Studio[] = await studioRepo.find();
            return response.status(200).json(success("Fetched all studios", sudios))
        } catch (error) {
            return response.status(500).json(failed(error.toString(),));
        }
    }

    static async postStudio(request: Request, response: Response) {
        try {
            const studioRepo = AppDataSource.getRepository(Studio)
            const requestBody = plainToClass(StudioRequest, request.body)
            const errors = await validate(requestBody);
            if (errors.length === 0) {
                const savedStudio = await studioRepo.save(requestBody);
                return response.status(200).json(success(`${savedStudio.name} saved`))
            }
            return response.status(400).json(failed(errors.toString()))
        } catch (error) {
            return response.status(500).json(failed(error.toString(),));
        }
    }

    static async updateStudio(request: Request, response: Response) {

    }
}