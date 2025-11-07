import { T } from "../libs/types/common";
import { Request, Response } from "express";

const orderController: T = {};

/** ADMIN --> ORDERS **/
orderController.getAllOrdersByAdmin = async (req: Request, res: Response) => {};

orderController.updateOrderByAdmin = async (req: Request, res: Response) => {};

export default orderController;
