import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { StudioRequest } from "../dtos/studio.request";
import { Studio } from "../entity/Studio.entity";
import { AppError, NotFound } from "../helpers/custom_error";
const { success } = require("../helpers/response");
const { tryCatch } = require("../helpers/try_catch");
export class StudioController {
    static getStudios = tryCatch(async (request: Request, response: Response) => {
        const studioRepo = AppDataSource.getRepository(Studio)
        const studios: Studio[] = await studioRepo.find();
        return response.status(200).json(success("Fetched all studios", studios))
    })
    static postStudio = tryCatch(async (request: Request, response: Response) => {
        const studioRepo = AppDataSource.getRepository(Studio)
        const requestBody = plainToClass(StudioRequest, request.body)
        const errors = await validate(requestBody);
        if (errors.length === 0) {
            const studio = StudioController.doesStudioExistByName(requestBody.name)
            if (studio) {
                throw new AppError("Studio exist")
            }
            const savedStudio = await studioRepo.save(requestBody);
            return response.status(200).json(success(`${savedStudio.name} saved`))
        }
        throw errors;
    })

    static updateStudio = tryCatch(async (request: Request, response: Response) => {
        const studioRepo = AppDataSource.getRepository(Studio);
        const studioId = request.params.id;
        const requestBody = plainToClass(StudioRequest, request.body);
        const selectedStudio = await studioRepo.findOne({ where: { id: studioId } })
        if (!selectedStudio) {
            return new NotFound()
        }
        if (selectedStudio) {
            studioRepo.merge(selectedStudio, requestBody);
            await studioRepo.save(selectedStudio);
            return response.status(200).json(success(`${requestBody.name} updates`))
        }
    })




    static async doesStudioExistByName(name: string) {
        const studioRepo = AppDataSource.getRepository(Studio);
        const studio = await studioRepo.findOne({ where: { name: name } });
        return studio;
    }
}