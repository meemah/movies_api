import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { GenreRequest } from "../dtos/genre.request";
import { Genre } from "../entity/Genre.entity";
const { failed, success, validator } = require("../helpers/response")
export class GenreController {
    static async addGenre(request: Request, response: Response) {
        try {
            const genreRepo = AppDataSource.getRepository(Genre);
            const requestBody = plainToClass(GenreRequest, request.body);
            const errors = await validate(requestBody);
            if (errors.length == 0) {
                const doesGenreExist = await GenreController.doesGenreExist(requestBody.name);
                if (doesGenreExist) {
                    return response.status(400).json(failed("Genre exist"))
                } else {
                    const genre = await genreRepo.save(requestBody);
                    return response.status(200).json(success(`${genre.name} added`, genre))
                }
            } else {
                return response.status(400).json(failed(errors.toString()))
            }
        } catch (error) {
            return response.status(500).json(failed(error.toString(),));
        }
    }
    static async updateGenre(request: Request, response: Response) {
        try {
            const genreId = request.params.id;
            const genreRepo = AppDataSource.getRepository(Genre)
            const selectedGenre = await genreRepo.findOne({ where: { id: genreId } })
            if (!selectedGenre) {
                return response.status(404).json(failed("Genre not found"))
            }
            genreRepo.merge(selectedGenre, request.body,);
            await genreRepo.save(selectedGenre);
            return response.status(200).json(success(`Genre updated`))
        } catch (error) {
            return response.status(500).json(failed(error.toString(),));
        }

    }

    static async getAllGenres(request: Request, response: Response) {
        try {
            const genreRepo = AppDataSource.getRepository(Genre);
            const genres: Genre[] = await genreRepo.find()
            return response.status(200).json(success("Genres fetched", genres))
        } catch (e) {
            return response.status(500).json(failed(e.toString(),));
        }
    }

    static async doesGenreExist(name: string): Promise<Genre | null> {
        const genreRepo = AppDataSource.getRepository(Genre);
        return genreRepo.findOne({ where: { name: name } });

    }
}