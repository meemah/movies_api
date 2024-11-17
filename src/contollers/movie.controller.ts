import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { In } from "typeorm/find-options/operator/In";
import { Repository } from "typeorm/repository/Repository";
import { AppDataSource } from "../data-source";
import { MovieRequest } from "../dtos/movie.request";
import { Cast } from "../entity/Cast.entity";
import { Director } from "../entity/Director.entity";
import { Genre } from "../entity/Genre.entity";
import { Movie } from "../entity/Movie.entity";
import { Review } from "../entity/Review.entity";
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

            const requestedGenres: Genre[] = await this.validateEntitiesExist({
                repo: genreRepo,
                requestedIds: requestBody.genres,
                entityName: Genre.name
            }) as Genre[];
            const requestedDirector: Director = await this.validateEntitiesExist({
                repo: directorRepo,
                requestedIds: requestBody.directorId,
                entityName: Director.name
            }) as Director;
            const requestedStudio: Studio = await this.validateEntitiesExist({
                repo: studioRepo,
                requestedIds: requestBody.studioId,
                entityName: Studio.name
            }) as Studio;
            const requestedCasts: Cast[] = await this.validateEntitiesExist({
                repo: castRepo,
                requestedIds: requestBody.casts,
                entityName: Cast.name
            }) as Cast[];

            const movie: Movie = await movieRepo.save({ ...requestBody, genres: requestedGenres, director: requestedDirector, studio: requestedStudio, casts: requestedCasts });
            return response.status(200).json(success(`${requestBody.title} added`, movie))
        } else {
            throw errors;
        }

    });

    static getMovies = tryCatch(async (request: Request, response: Response) => {
        const movieRepo = AppDataSource.getRepository(Movie);
        const { entities, raw } = await movieRepo
            .createQueryBuilder("movie")
            .leftJoinAndSelect("movie.director", "director")
            .leftJoinAndSelect("movie.studio", "studio")
            .leftJoinAndSelect("movie.genres", "genres")
            .leftJoinAndSelect("movie.cast", "cast")
            .leftJoin("movie.reviews", "review")
            .addSelect((subQuery) => {
                return subQuery
                    .select("COALESCE(AVG(review.rating), 0)", "averageRating")
                    .from(Review, "review")
                    .where('review."movieId" = movie.id');
            }, "averageRating")
            .getRawAndEntities();


        const moviesWithRatings = entities.map((entity, index) => ({
            ...entity,
            averageRating: Number(raw[index].averageRating)
        }));
        return response.status(200).json(success("Movies fetched", moviesWithRatings));


    })

    static updateMovie = tryCatch(async (request: Request, response: Response) => {
        const movieId = request.params.id;
        const movieRepo = AppDataSource.getRepository(Movie);

        const requestBody = plainToClass(MovieRequest, request.body);

        if (String(movieId).length === 0) {
            return new AppError("Movie ID is empty");
        }

        const movie: Movie = await movieRepo.findOne({
            where: {
                id: movieId
            }
        });

        if (movie) {
            movieRepo.merge(movie, request.body);
            await movieRepo.save(movie);
            return response.status(200).json(success(`${requestBody.title} updated`, movie))
        } else {
            return new NotFound("Movie not found");
        }


    })
    static async validateEntitiesExist<T, K extends keyof T>({
        repo,
        requestedIds,
        entityName,
        idField = "id" as K,
        conditions = {},
    }: {
        repo: Repository<T>;
        requestedIds: string | number | (string | number)[];
        entityName: string;
        idField?: K;
        conditions?: Partial<Record<keyof T, any>>;
    }
    ): Promise<T[] | T> {

        if (Array.isArray(requestedIds)) {
            const whereClause = { ...conditions, [idField]: In(requestedIds) } as any;

            const entities = await repo.find({ where: whereClause });
            const foundIds = new Set(entities.map(entity => String((entity as any)[idField])));
            const missingIds = requestedIds.filter(id => !foundIds.has(String(id)));

            if (missingIds.length > 0) {
                throw new AppError(`${entityName} with IDs ${missingIds.join(', ')} not found.`);
            }

            return entities;
        } else {
            const whereClause = { ...conditions, [idField]: requestedIds };

            const entity: T = await repo.findOne({
                where: whereClause
            })

            if (!entity && requestedIds) {
                throw new NotFound(`${entityName} id not found`)
            }
            return entity;
        }

    }

}