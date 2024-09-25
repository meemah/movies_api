import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { GenreRequest } from "../dtos/genre.request";
import { Genre } from "../entity/Genre.entity";
import { AppError, NotFound } from "../helpers/custom_error";
const { success } = require("../helpers/response");
const { tryCatch } = require("../helpers/try_catch");

export class GenreController {

    static addGenre = tryCatch(async (request: Request, response: Response) => {
        const genreRepo = AppDataSource.getRepository(Genre);
        const requestBody = plainToClass(GenreRequest, request.body);
        const errors = await validate(requestBody);
        if (errors.length == 0) {
            const doesGenreExist = await GenreController.doesGenreExist(requestBody.name);
            if (doesGenreExist) {
                throw new AppError("Director exists");
            } else {
                const genre = await genreRepo.save(requestBody);
                return response.status(200).json(success(`${genre.name} added`, genre))
            }
        } else {
            throw errors;
        }
    })
    static updateGenre = tryCatch(async (request: Request, response: Response) => {
        const genreId = request.params.id;
        const genreRepo = AppDataSource.getRepository(Genre)
        const selectedGenre = await genreRepo.findOne({ where: { id: genreId } })
        if (!selectedGenre) {
            return new NotFound("Genre not found");
        }
        genreRepo.merge(selectedGenre, request.body,);
        await genreRepo.save(selectedGenre);
        return response.status(200).json(success(`Genre updated`))
    })


    static getAllGenres = tryCatch(async (request: Request, response: Response) => {
        const genreRepo = AppDataSource.getRepository(Genre);
        const genres: Genre[] = await genreRepo.find()
        return response.status(200).json(success("Genres fetched", genres))
    });


    static async doesGenreExist(name: string): Promise<Genre | null> {
        const genreRepo = AppDataSource.getRepository(Genre);
        return genreRepo.findOne({ where: { name: name } });

    }
}