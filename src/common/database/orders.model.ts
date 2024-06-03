import {Document, Schema} from 'mongoose';
import { IProduct, ProductSchema } from './product.model';
import { OrderStatus } from '../constants/order-status';

interface IOrder extends Document{
  userId: string,
  productList: IProduct[],
  status: OrderStatus,
  totalAmount:number
}
const OrderSchema = new Schema({
   userId: String,
   productList: {
    type: [ProductSchema],
  },
   status:{
    type: String,
    enum: Object.values(OrderStatus),

   },
   totalAmount: Number
    
  },{timestamps:true});

  export {
    IOrder,
    OrderSchema
  }