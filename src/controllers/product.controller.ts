import { Request, Response } from "express";
import ProductService from "../models/Product.service";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { AdminRequest } from "../libs/types/member";

const productService = new ProductService();
const productController: T = {};

/** SSR --> ADMIN **/

productController.getAllProductsByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("getAllProductsByAdmin");
    const data = await productService.getAllProductsByAdmin();

    res.render("products", { products: data });
  } catch (err) {
    console.log("Error, getAllProductsByAdmin", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
