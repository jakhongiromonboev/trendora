import express from "express";
import adminController from "./controllers/admin.controller";

const routerAdmin = express.Router();

/** HOME **/
routerAdmin.get("/", adminController.goHome);

/** AUTHENTICATION **/
routerAdmin
  .get("/signup", adminController.getSignup)
  .post("/signup", adminController.processSignup);

routerAdmin
  .get("/login", adminController.getLogin)
  .post("/login", adminController.processLogin);

/** DASHBOARD **/

/** PRODUCTS **/

/** USERS **/

/** ANALYTICS **/

/** SETTINGS **/

export default routerAdmin;
