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
            const studios: Studio[] = await studioRepo.find();
            return response.status(200).json(success("Fetched all studios", studios))
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
                const studio = StudioController.doesStudioExistByName(requestBody.name)
                if (studio) {
                    return response.status(400).json(failed("Studio exist"))
                }
                const savedStudio = await studioRepo.save(requestBody);
                return response.status(200).json(success(`${savedStudio.name} saved`))
            }
            return response.status(400).json(failed(errors.toString()))
        } catch (error) {
            return response.status(500).json(failed(error.toString(),));
        }
    }

    static async updateStudio(request: Request, response: Response) {
        try {
            const studioRepo = AppDataSource.getRepository(Studio);
            const studioId = request.params.id;
            const requestBody = plainToClass(StudioRequest, request.body);
            const selectedStudio = await studioRepo.findOne({ where: { id: studioId } })
            if (!selectedStudio) {
                return response.status(404).json(failed("Studio not found"))
            }
            if (selectedStudio) {
                studioRepo.merge(selectedStudio, requestBody);
                await studioRepo.save(selectedStudio);
                return response.status(200).json(success(`${requestBody.name} updates`))
            }

        } catch (error) {
            return response.status(500).json(failed(error.toString(),));
        }

    }

    static async doesStudioExistByName(name: string) {
        const studioRepo = AppDataSource.getRepository(Studio);
        const studio = await studioRepo.findOne({ where: { name: name } });
        return studio;
    }
}