import express from "express";
import { DirectorController } from "../contollers/director.controller";

const Router = express.Router()

Router.get("/directors", DirectorController.getAllDirectors)
Router.post("/director", DirectorController.addDirector)
Router.put("/director/:id", DirectorController.updateDirector)
export { Router as DirectorRouter };
