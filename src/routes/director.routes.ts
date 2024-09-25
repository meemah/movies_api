import express from "express";
import { DirectorController } from "../contollers/director.controller";
import { AuthorizationMiddleware } from "../middlewares/authorization_middleware";
const Router = express.Router()
Router.use(AuthorizationMiddleware);
Router.get("/directors", DirectorController.getAllDirectors)
Router.post("/director", DirectorController.addDirector)
Router.put("/director/:id", DirectorController.updateDirector)
export { Router as DirectorRouter };
