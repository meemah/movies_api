import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ReviewRequest } from "../dtos/review.request";
import { Review } from "../entity/Review.entity";
const { failed, success, } = require("../helpers/response")
export class ReviewController {
    static async addReview(request: Request, response: Response) {
        const movieId = request.params.id;
        const userId = request.body.user
        try {
            const reviewRepo = AppDataSource.getRepository(Review);
            const requestBody = plainToClass(ReviewRequest, request.body);
            const errors = await validate(requestBody);
            if (errors.length == 0) {
                const review = await reviewRepo.save({ ...requestBody, movieId, userId });
                return response.status(200).json(success("Review Added", review))

            } else {
                return response.status(400).json(failed(errors.toString()))
            }
        } catch (error) {
            return response.status(500).json(failed(error.toString(),));
        }
    }


    static async getAllMovieReviews(request: Request, response: Response) {
        try {
            const movieId = request.params.id;
            const reviewRepo = AppDataSource.getRepository(Review);
            const reviews: Review[] = await reviewRepo.find({ where: { movieId: movieId } })
            return response.status(200).json(success("Reviews fetched", reviews))
        } catch (e) {
            return response.status(500).json(failed(e.toString(),));
        }
    }

}