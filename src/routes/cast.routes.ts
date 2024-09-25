import express from "express";
import { CastController } from "../contollers/cast.controller";
import { AuthorizationMiddleware } from "../middlewares/authorization_middleware";
const Router = express.Router();
Router.use(AuthorizationMiddleware);
Router.get("/casts", CastController.getAllCast);
Router.put("/cast/:id", CastController.updateCast);
Router.post("/cast", CastController.addCast);

export { Router as CastRouter };
