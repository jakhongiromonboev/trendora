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

/** 1-ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** 2-SESSIONS **/

/** 3-VIEWS **/

/** 4-ROUTER **/

export default app;
