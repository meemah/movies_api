import express from "express";
import { GenreController } from "../contollers/genre.controller";
const Router = express.Router();

Router.get("/genres", GenreController.getAllGenres);
Router.post("/genre", GenreController.addGenre);
Router.put("/genre/:id", GenreController.updateGenre);

export { Router as GenreRouter };
