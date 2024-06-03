import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
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

    async fetch(code:number){
        await this.discountCouponModel.findOne({code})
    }
}