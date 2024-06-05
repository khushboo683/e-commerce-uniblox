/* eslint-disable @typescript-eslint/naming-convention */
import {Document, Schema} from 'mongoose';
import { DiscountCouponStatus } from '../constants/discount-coupon-status';

export interface IDiscountCoupon{
   userId:string
   code:string
   discountPercent:number
   status:DiscountCouponStatus
   expireAtOrder: number
}
export const DiscountCouponSchema= new Schema({
    userId:String,
    code:String,
    discountPercent:Number,
    status:{
        type:String,
        enum: Object.values(DiscountCouponStatus)
    },
    expireAtOrder:Number
})
// export {
//     IDiscountCoupon,
//     DiscountCouponSchema
// }

