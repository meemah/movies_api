
import express from "express";
import { ReviewController } from "../contollers/review.controller";
import { AuthorizationMiddleware } from "../middlewares/authorization_middleware";
const Router = express.Router()
Router.use(AuthorizationMiddleware);
Router.get("/movies/:id/reviews", ReviewController.getAllMovieReviews)
Router.post("/movies/:id/reviews", ReviewController.addReview)

export { Router as ReviewRouter };
