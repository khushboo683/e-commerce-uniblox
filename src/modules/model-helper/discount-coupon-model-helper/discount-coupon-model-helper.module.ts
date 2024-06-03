import { Module } from "@nestjs/common";
import { DiscountCouponModelHelperService } from "./discount-coupon-model-helper.service";

@Module({
  providers:[DiscountCouponModelHelperService],
  exports:[DiscountCouponModelHelperService]
})
export class DiscountCouponHelperModule{}