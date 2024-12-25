import express from "express";
import { login, register } from "../controller/stateOffices.controller.js";

const stateRoute = express.Router();
stateRoute.post("/signup", register);
stateRoute.post("/login", login);

export default stateRoute;
