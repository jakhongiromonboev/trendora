import express from "express";
import adminController from "./controllers/admin.controller";
import makeUpLoader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";

const routerAdmin = express.Router();

/** HOME **/
routerAdmin.get("/", adminController.goHome);

/** AUTHENTICATION **/

routerAdmin
  .get("/signup", adminController.getSignup)
  .post(
    "/signup",
    makeUpLoader("members").single("memberImage"),
    adminController.processSignup
  );

routerAdmin
  .get("/login", adminController.getLogin)
  .post("/login", adminController.processLogin);

routerAdmin.get("/logout", adminController.logout);
routerAdmin.get("/check-me", adminController.checkAuthSession);

/** DASHBOARD **/

/** PRODUCTS **/

routerAdmin.get(
  "/product/all",
  adminController.verifyAdmin,
  productController.getAllProductsByAdmin
);

routerAdmin.post(
  "/product/create",
  adminController.verifyAdmin,
  makeUpLoader("products").array("productImages", 5),
  productController.createNewProduct
);

routerAdmin.post(
  "/product/:id",
  adminController.verifyAdmin,
  productController.updateChosenProduct
);

/** USERS **/

routerAdmin.get(
  "/user/all",
  adminController.verifyAdmin,
  adminController.getAllUsers
);

routerAdmin.post(
  "/user/edit",
  adminController.verifyAdmin,
  adminController.updateMemberByAdmin
);

/** ORDERS **/

routerAdmin.get(
  "/order/all",
  adminController.verifyAdmin,
  orderController.getAllOrdersByAdmin
);

/** ANALYTICS **/

/** SETTINGS **/

export default routerAdmin;
