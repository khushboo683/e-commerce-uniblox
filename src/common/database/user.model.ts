import {Document, Schema} from 'mongoose';
import { Roles } from '../constants/roles';
import { IOrder, OrderSchema } from './orders.model';
import { IProductList } from 'src/modules/user/users.interface';

interface IAddress extends Document{
    addressLine1: string,
    city:string,
    state:string,
    pincode:string
}
const AddressSchema= new Schema({
    addressLine1: String,
    city:String,
    state:String,
    pincode:String
})
interface ICart {
    productList:IProductList[];
    cartValue: number;
  }
  
  const CartSchema = new Schema({
    productList: [
      {
        productId: String,
        productName: String,
        count: Number, 
      },
    ],
    cartValue:{ type:Number, default:0},
  }, {
    _id: false,
  });
interface User{
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
  UserSchema.index({ "mobile": 1 });
  export {
    User,
    UserSchema,
    ICart,
    CartSchema,
};