import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { In } from "typeorm/find-options/operator/In";
import { AppDataSource } from "../data-source";
import { MovieRequest } from "../dtos/movie.request";
import { Cast } from "../entity/Cast.entity";
import { Director } from "../entity/Director.entity";
import { Genre } from "../entity/Genre.entity";
import { Movie } from "../entity/Movie.entity";
import { Studio } from "../entity/Studio.entity";
import { AppError, NotFound } from "../helpers/custom_error";
const { success } = require("../helpers/response");
const { tryCatch } = require("../helpers/try_catch");


export class MovieController {
    static addMovie = tryCatch(async (request: Request, response: Response) => {
        const directorRepo = AppDataSource.getRepository(Director);
        const genreRepo = AppDataSource.getRepository(Genre);
        const movieRepo = AppDataSource.getRepository(Movie);
        const studioRepo = AppDataSource.getRepository(Studio);
        const castRepo = AppDataSource.getRepository(Cast);
        const requestBody = plainToClass(MovieRequest, request.body);
        const errors = await validate(requestBody);
        if (errors.length == 0) {
            /// Genre
            const requestGenres: Genre[] = await genreRepo.find({
                where: {
                    id: In(requestBody.genres)
                }
            })
            const foundIds = requestGenres.map(genre => genre.id);
            const missingIds = requestGenres.filter(genre => !foundIds.includes(genre.id));
            if (missingIds.length > 0) {
                throw new AppError(`Genres with IDs ${missingIds.join(', ')} not found.`);
            }

            // Director
            const requestedDirector: Director = await directorRepo.findOne({
                where: { id: requestBody.directorId }
            })

            if (!requestedDirector && requestBody.directorId) {
                throw new NotFound("Director id not found")
            }

            /// Studio

            const requestedStudio: Studio = await studioRepo.findOne({
                where: {
                    id: requestBody.studioId
                }
            })

            if (!requestedStudio && requestBody.studioId) {
                throw new NotFound("Studio id not found")
            }
            /// cast

            const requestedCasts: Cast[] = await castRepo.find({
                where: {
                    id: In(requestBody.casts)
                }
            })
            if (requestedCasts.length !== requestBody.casts.length) {

                const foundCastIds = new Set(requestedCasts.map(cast => cast.id));
                const missingCastIds = requestBody.casts.filter(id => !foundCastIds.has(id));

                throw new NotFound(`Casts with IDs ${missingCastIds.join(', ')} not found.`);
            }

            const movie: Movie = await movieRepo.save({ ...requestBody, genres: requestGenres, director: requestedDirector, studio: requestedStudio, casts: requestedCasts });
            return response.status(200).json(success(`${requestBody.title} added`, movie))
        } else {
            throw errors;
        }

    });
}