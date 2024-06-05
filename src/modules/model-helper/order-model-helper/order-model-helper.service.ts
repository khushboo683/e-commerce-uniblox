import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { ORDER_MODEL } from "../../../common/database/database.constants";
import { IOrder } from "src/common/database/orders.model";

@Injectable()
export class OrderModelHelperService{

    constructor(
        @Inject(ORDER_MODEL)
        private orderModel:Model<IOrder>
    ){}
    async createOrder(body:IOrder){
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