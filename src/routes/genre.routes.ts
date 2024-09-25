import express from "express";
import { GenreController } from "../contollers/genre.controller";

import { AuthorizationMiddleware } from "../middlewares/authorization_middleware";
const Router = express.Router();
Router.use(AuthorizationMiddleware);
Router.get("/genres", GenreController.getAllGenres);
Router.post("/genre", GenreController.addGenre);
Router.put("/genre/:id", GenreController.updateGenre);

export { Router as GenreRouter };
