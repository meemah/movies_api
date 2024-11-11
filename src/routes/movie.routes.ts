
import express from "express";

import { MovieController } from "../contollers/movie.controller";
import { AuthorizationMiddleware } from "../middlewares/authorization_middleware";
const Router = express.Router();
Router.use(AuthorizationMiddleware);
Router.post("/movie", MovieController.addMovie);


export { Router as MovieRouter };
