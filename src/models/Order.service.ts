import OrderItemModel from "../schema/OrderItem.model";
import OrderModel from "../schema/Order.model";
import {
  Order,
  OrderInquiry,
  OrderItemInput,
  OrderUpdateInput,
} from "../libs/types/order";
import { T } from "../libs/types/common";
import { OrderStatus } from "../libs/enums/order.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import MemberService from "./Member.service";
import { Member } from "../libs/types/member";
import { ObjectId } from "mongoose";
import ProductService from "./Product.service";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly memberService;
  private readonly productService;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.memberService = new MemberService();
    this.productService = new ProductService();
  }

  /** SPA --> USER **/
  public async createOrder(
    member: Member,
    input: OrderItemInput[]
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
      return accumulator + item.itemPrice * item.itemQuantity;
    }, 0);
    const delivery = amount < 110 ? 6 : 0;

    try {
      const newOrder: Order = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId: memberId,
      });
      console.log("OrderId:", newOrder._id);
      const orderId = newOrder._id;
      await this.recordOrderItems(orderId, input);

      return newOrder;
    } catch (err) {
      console.log("Error,model:createOrder", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  private async recordOrderItems(
    orderId: ObjectId,
    input: OrderItemInput[]
  ): Promise<void> {
    try {
      const promisedList = input.map(async (item: OrderItemInput) => {
        item.orderId = orderId;
        item.productId = shapeIntoMongooseObjectId(item.productId);
        await this.orderItemModel.create(item);
        return "INSERTED";
      });
      const orderItemState = await Promise.all(promisedList);

      for (const item of input) {
        await this.productService.updateProductLeftCount(
          item.productId,
          item.itemQuantity
        );
      }
      console.log("Order items recorded:", orderItemState);
    } catch (err) {
      console.log("Error:recordOrderItems", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getMyOrders(
    member: Member,
    inquiry: OrderInquiry
  ): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const matches: T = { memberId: memberId, orderStatus: inquiry.orderStatus };

    const result = await this.orderModel
      .aggregate([
        { $match: matches },
        { $sort: { updatedAt: -1 } },
        { $skip: (inquiry.page - 1) * inquiry.limit },
        { $limit: inquiry.limit },
        {
          $lookup: {
            from: "orderItems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  /** SSR --> ADMIN **/
  public async getAllOrdersByAdmin(inquiry: OrderInquiry): Promise<Order[]> {
    const { page, limit, orderStatus } = inquiry;
    const match: T = {};

    if (orderStatus) match.orderStatus = orderStatus;
    const result = await this.orderModel
      .aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: "members",
            localField: "memberId",
            foreignField: "_id",
            as: "memberData",
          },
        },
      ])
      .exec();

    return result;
  }

  public async updateOrderByAdmin(input: OrderUpdateInput): Promise<Order> {
    const orderId = shapeIntoMongooseObjectId(input.orderId);
    const orderStatus = input.orderStatus;

    const order: Order | null = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        orderStatus: orderStatus,
      },
      { new: true }
    );
    if (!order) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (orderStatus === OrderStatus.PROCESSING) {
      await this.memberService.addUserPoint(order.memberId, 1);
    }
    return order;
  }
}

export default OrderService;
