import {Document, Schema, Types} from 'mongoose';
import { Roles } from '../constants/roles';
import { IOrder, OrderSchema } from './orders.model';

interface IAddress extends Document{
    addressLine1: string,
    city:string,
    state:string,
    pincode:string
}
export const AddressSchema= new Schema({
    addressLine1: String,
    city:String,
    state:String,
    pincode:String
})
interface ICart extends Document {
    productDetails: {
      productId?: string;
      productName: string;
      count: number;
    }[];
    cartValue: number;
  }
  
  export const CartSchema = new Schema({
    productDetails: [
      {
        productId: String,
        productName: String,
        count: Number, // Corrected to Number for count
      },
    ],
    cartValue: Number,
  }, {
    _id: false,
  });
interface User extends Document{
    name: string,
    email: string,
    mobile: string,
    password: string,
    role:Roles,
    cart?:ICart,
    orders?:IOrder[],
    address?:IAddress
}
const UserSchema = new Schema({
    name: String,
    email: String,
    mobile: String,
    password: String,
    role: {
        type: String,
        enum: Object.values(Roles),
    },
    cart:{
      type:CartSchema
    },
    orders:{
        type:[OrderSchema]
    },
    address:{
        type: AddressSchema
    }
    
  },{timestamps:true});

  export {
    User,
    UserSchema, ICart
};