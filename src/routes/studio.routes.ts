
import express from "express";
import { StudioController } from "../contollers/studio.controller";

const Router = express.Router()

Router.get("/studios", StudioController.getStudios)
Router.post("/studio", StudioController.postStudio)
Router.put("/studio/:id", StudioController.updateStudio)

export { Router as studioRouter };
