import express from "express";
import { AuthController } from "../contollers/auth.controller";

const Router = express.Router();

Router.post("/login", AuthController.login)

Router.post("/signup", AuthController.createAccount)

export { Router as AuthRouter };
