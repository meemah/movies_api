import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ReviewRequest } from "../dtos/review.request";
import { Movie } from "../entity/Movie.entity";
import { Review } from "../entity/Review.entity";
import { NotFound } from "../helpers/custom_error";
const { success } = require("../helpers/response");
const { tryCatch } = require("../helpers/try_catch");
export class ReviewController {
    static addReview = tryCatch(async (request: Request, response: Response) => {
        const movieId = request.params.id;

        const userId = request.body.user.id

        const reviewRepo = AppDataSource.getRepository(Review);
        const movieRepo = AppDataSource.getRepository(Movie);
        const requestBody = plainToClass(ReviewRequest, request.body);

        const errors = await validate(requestBody);
        const movie = await movieRepo.findOne({
            where: {
                id: movieId
            }
        })
        if (errors.length == 0) {
            if (!movie) {
                return new NotFound("Movie not found")
            }
            const review = await reviewRepo.save({
                comment: requestBody.comment,
                rating: requestBody.rating,
                userId: userId,
                movie: movie

            })
            return response.status(200).json(success("Review Added", review))

        } else {
            throw errors;
        }
    })

    static getAllMovieReviews = tryCatch(async (request: Request, response: Response) => {
        const movieId = request.params.id;
        const reviewRepo = AppDataSource.getRepository(Review);
        const movieRepo = AppDataSource.getRepository(Movie);
        const movie = await movieRepo.findOne({
            where: {
                id: movieId
            }
        })
        if (!movie) {
            return new NotFound("Movie not found")
        }
        const reviews: Review[] = await reviewRepo.find({ where: { movie: movie } })
        return response.status(200).json(success("Reviews fetched", reviews))
    })


}