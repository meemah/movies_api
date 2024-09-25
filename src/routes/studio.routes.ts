
import express from "express";
import { StudioController } from "../contollers/studio.controller";
import { AuthorizationMiddleware } from "../middlewares/authorization_middleware";
const Router = express.Router()
Router.use(AuthorizationMiddleware);
Router.get("/studios", StudioController.getStudios)
Router.post("/studio", StudioController.postStudio)
Router.put("/studio/:id", StudioController.updateStudio)

export { Router as StudioRouter };
