import express from "express";
import adminController from "./controllers/admin.Controller";

const routerAdmin = express.Router();

/** AUTHENTICATION **/
routerAdmin.post("/signup", adminController.processSignup);

/** DASHBOARD **/

export default routerAdmin;
