import { OrderInquiry, OrderUpdateInput } from "../libs/types/order";
import Errors, { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import { OrderStatus } from "../libs/enums/order.enum";
import OrderService from "../models/Order.service";
import { ExtendedRequest } from "../libs/types/member";

const orderController: T = {};
const orderService = new OrderService();

/** SPA --> USER **/
orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createOrder");
    const result = await orderService.createOrder(req.member, req.body);
    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error:createOrder", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getMyOrders");
    const { page, limit, orderStatus } = req.query;

    const inquiry: OrderInquiry = {
      page: Number(page),
      limit: Number(limit),
      orderStatus: orderStatus as OrderStatus,
    };
    const result = await orderService.getMyOrders(req.member, inquiry);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMyOrders", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** ADMIN (SSR) --> ORDERS **/
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
    res.render("orders", {
      orders: result,
      page: inquiry.page,
      limit: inquiry.limit,
      orderStatus: orderStatus,
    });
  } catch (err) {
    console.log("Error,getAllOrdersByAdmin", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.getAllOrderItemsByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("getAllOrderItemsByAdmin");
    const { id } = req.query;
    console.log("id", id);
    const result = await orderService.getAllOrderItemsByAdmin(id as string);
    res.status(HttpCode.OK).json(result);
    // res.render("orders", { orderItems: result });
  } catch (err) {
    console.log("Error, getAllOrderItemsByAdmin:", err);
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
    console.log("Error,updateOrderByAdmin", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default orderController;
