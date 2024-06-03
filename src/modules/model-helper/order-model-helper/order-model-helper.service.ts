import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { OrderStatus } from "src/common/constants/order-status";
import { ORDER_MODEL } from "src/common/database/database.constants";
import { IOrder } from "src/common/database/orders.model";

@Injectable()
export class OrderModelHelperService{

    constructor(
        @Inject(ORDER_MODEL)
        private orderModel:Model<IOrder>
    ){}
    async createOrder(body:any){
     return await this.orderModel.create(body);
    }
    async getOrders(){
      return await this.orderModel.find();
    }
    async updateOrderDetail(id:string, updateObj: Partial<IOrder>) {
        return this.orderModel.findOneAndUpdate({_id:id}, { ...updateObj}, {
          new: true,
        });
      }
}