import {Document, Schema} from 'mongoose';
import { OrderStatus } from '../constants/order-status';

interface IOrder{
  userId: string,
  productList: any[],
  status: OrderStatus,
  totalAmount:number,
  discount?:number,
  totalAmountAfterDiscount?:number
}
const OrderSchema = new Schema({
   userId: String,
   productList:Object,
   status:{
    type: String,
    enum: Object.values(OrderStatus),

   },
   totalAmount: Number,
   discount:Number,
   totalAmountAfterDiscount:Number
    
  },{timestamps:true});

  export {
    IOrder,
    OrderSchema
  }