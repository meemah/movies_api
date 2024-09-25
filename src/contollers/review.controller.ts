import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ReviewRequest } from "../dtos/review.request";
import { Review } from "../entity/Review.entity";
const { success } = require("../helpers/response");
const { tryCatch } = require("../helpers/try_catch");
export class ReviewController {
    static addReview = tryCatch(async (request: Request, response: Response) => {
        const movieId = request.params.id;
        const userId = request.body.user
        const reviewRepo = AppDataSource.getRepository(Review);
        const requestBody = plainToClass(ReviewRequest, request.body);
        const errors = await validate(requestBody);
        if (errors.length == 0) {
            const review = await reviewRepo.save({ ...requestBody, movieId, userId });
            return response.status(200).json(success("Review Added", review))

        } else {
            throw errors;
        }
    })

    static getAllMovieReviews = tryCatch(async (request: Request, response: Response) => {
        const movieId = request.params.id;
        const reviewRepo = AppDataSource.getRepository(Review);
        const reviews: Review[] = await reviewRepo.find({ where: { movieId: movieId } })
        return response.status(200).json(success("Reviews fetched", reviews))
    })


}