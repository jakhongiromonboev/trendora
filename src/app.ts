import cors from "cors";
import express from "express";
import path, { dirname } from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";
import { MORGAN_FORMAT } from "./libs/config";

/** 1-ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/

/** 3-VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 4-ROUTER **/
app.use("/admin", routerAdmin);
app.use("/", router);

export default app;
