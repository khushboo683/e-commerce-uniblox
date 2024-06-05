import { BadRequestException, Injectable } from '@nestjs/common';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';
import crypto = require('crypto');
import { DiscountCouponModelHelperService } from '../model-helper/discount-coupon-model-helper/discount-coupon-model-helper.service';
import { DiscountCouponStatus } from '../../common/constants/discount-coupon-status';
import { IDiscountCoupon } from 'src/common/database/discount-coupons.model';
import { UserDto} from '../user/users.dto';
@Injectable()
export class AdminService {
    constructor(
        private userModelHelper: UserModelHelperService,
        private discountCouponModelHelper: DiscountCouponModelHelperService,
    ){}
    private orderFrequencyForCoupon=process.env.ORDER_FREQUENCY_FOR_COUPON
    generateRandomString = (length: number) => {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    };
     /**
     * Generates a discount coupon for the user if eligible.
     * @param body - The UserDto containing the user's mobile number.
     * @returns The created discount coupon.
     */
    async generateCoupon(body:UserDto){
        const {mobile}=body
    const user = await this.userModelHelper.findUserWithMobile(mobile) 
    let noOfOrders=user?.orders?.length || 0;
    if((noOfOrders+1)%Number(this.orderFrequencyForCoupon)){
        throw new BadRequestException('User is not eligible for discount coupon')
    }
    const code = this.generateRandomString(6);
    const couponObj: IDiscountCoupon= {
       code:code,
       userId:mobile,
       discountPercent:10,
       status:DiscountCouponStatus.ACTIVE,
       expireAtOrder:noOfOrders+5+1
    };
    return await this.discountCouponModelHelper.createDiscountCoupon(couponObj)
    }
    /**
     * Retrieves user statistics and discount codes statistics.
     * @param body - The UserDto containing the user's mobile number.
     * @returns Object containing user statistics and discount codes statistics.
     */
    async getUserStats(body:UserDto){
     const userStats=await this.userModelHelper.getUserStats(body.mobile)
     const query={
        userId:body.mobile
     }
     const projection={
        code:1,
        status:1
     }
     const discountCodes=await this.discountCouponModelHelper.fetchCouponStats(query,projection)
     return {
        userStats,
        discountCodes
     }
    }
}
