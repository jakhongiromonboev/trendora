import { OrderInquiry, OrderUpdateInput } from "../libs/types/order";
import Errors, { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import { OrderStatus } from "../libs/enums/order.enum";
import OrderService from "../models/Order.service";

const orderController: T = {};
const orderService = new OrderService();

/** ADMIN --> ORDERS **/
orderController.getAllOrdersByAdmin = async (req: Request, res: Response) => {
  try {
    console.log("getAllOrdersByAdmin");
    const { page, limit, orderStatus } = req.query;

    const inquiry: OrderInquiry = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      orderStatus: orderStatus as OrderStatus,
    };

    const result = await orderService.getAllOrdersByAdmin(inquiry);
    // res.status(HttpCode.OK).json(result);
    res.render("orders", { orders: result });
  } catch (err) {
    console.log("Error:getAllOrdersByAdmin", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.updateOrderByAdmin = async (req: Request, res: Response) => {
  try {
    console.log("updateOrderByAdmin");
    const input: OrderUpdateInput = req.body;
    const result = await orderService.updateOrderByAdmin(input);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error:updateOrderByAdmin", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default orderController;
