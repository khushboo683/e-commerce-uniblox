import {Document, Schema} from 'mongoose';

interface IDiscountCoupon extends Document{
   code:string,
   discountPercent:number
   isUsed?:boolean
}
const DiscountCouponSchema= new Schema({
    code:String,
    discountPercent:Number,
    isUsed:Boolean
})
export {
    IDiscountCoupon,
    DiscountCouponSchema
}