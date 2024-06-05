import { Inject, Injectable } from "@nestjs/common";
import { FilterQuery, Model, ProjectionType } from "mongoose";
import { DiscountCouponStatus } from "src/common/constants/discount-coupon-status";
import { DISCOUNT_COUPON_MODEL } from "src/common/database/database.constants";
import { IDiscountCoupon } from "src/common/database/discount-coupons.model";

@Injectable()
export class DiscountCouponModelHelperService{
    constructor(
        @Inject(DISCOUNT_COUPON_MODEL)
        private discountCouponModel:Model<IDiscountCoupon>
    ){

    }
    async createDiscountCoupon(body:any){
        await this.discountCouponModel.create(body)
    }

    async fetchCoupon(query: FilterQuery<IDiscountCoupon>){
    
       return await this.discountCouponModel.findOne(query)
    }
    async fetchCouponStats(query:FilterQuery<IDiscountCoupon>, projection:ProjectionType<IDiscountCoupon>){
        return await this.discountCouponModel.find(query, projection)
    }
    async deactivateExpiredCopons(orderNo:number, mobile:string){
       await this.discountCouponModel.updateMany({
        userId:mobile,
        expireAtOrder:{ $lte: orderNo + 1 }
       },{
        $set:{
          status: DiscountCouponStatus.EXPIRED
        }
       })
    }
    async markDiscountCouponUsed(mobile:string){
        await this.discountCouponModel.updateOne({
            userId:mobile,
        },{
            $set:{
                status:DiscountCouponStatus.USED
            }
        })
    }
    async getDiscountCouponForValidation(couponCode:string, mobile:string){
        const couponFromDb= await this.discountCouponModel.findOne({
            userId:mobile,
            code:couponCode
        })
        if(couponFromDb?.code===couponCode)
            return true;
        return false;
    }
}