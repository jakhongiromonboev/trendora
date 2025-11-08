import OrderItemModel from "../schema/OrderItem.model";
import OrderModel from "../schema/Order.model";
import { Order, OrderInquiry, OrderUpdateInput } from "../libs/types/order";
import { T } from "../libs/types/common";
import { OrderStatus } from "../libs/enums/order.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import MemberService from "./Member.service";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly memberService;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.memberService = new MemberService();
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
