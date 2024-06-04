import { Injectable } from '@nestjs/common';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';
import { OrderModelHelperService } from '../model-helper/order-model-helper/order-model-helper.service';
import { OrderStatus } from 'src/common/constants/order-status';
import { ProductModelHelper } from '../model-helper/product-model-helper/product-model-helper.module';
import { ProductModelHelperService } from '../model-helper/product-model-helper/product-model-helper.service';
import crypto = require('crypto');
import { DiscountCouponModelHelperService } from '../model-helper/discount-coupon-model-helper/discount-coupon-model-helper.service';
import { DiscountCouponStatus } from 'src/common/constants/discount-coupon-status';
import { User } from 'src/common/database/user.model';
import { IDiscountCoupon } from 'src/common/database/discount-coupons.model';
import DocumentDefinition from "mongoose"
@Injectable()
export class AdminService {
    constructor(
        private userModelHelper: UserModelHelperService,
        private orderModelHelper: OrderModelHelperService,
        private productModelHelper:ProductModelHelperService,
        private discountCouponModelHelper: DiscountCouponModelHelperService
    ){}
    async getUsers(){
        return await this.userModelHelper.getUsers();
    }

    async getUserDetails(){

    }
    async getOrdersList(){
     return await this.orderModelHelper.getOrders();
    }
    async cancelOrder(id:string){
        const updateObj={
            status:OrderStatus.CANCELLED
        }
     return await this.orderModelHelper.updateOrderDetail(id,updateObj);
    }
    async addNewProduct(body:any){
       return await this.productModelHelper.createProduct(body)
    }
    generateRandomString = (length: number) => {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    };
    async generateCoupon(body:any){
        const {mobile}=body
    const user = await this.userModelHelper.findUserWithMobile(mobile) 
    let noOfOrders=user?.orders?.length || 0;
    if((noOfOrders+1)%5){
        throw new Error('User is not eligible for discount coupon')
    }
    const code = this.generateRandomString(6);
    const couponObj: Partial<IDiscountCoupon> = {
       code:code,
       userId:mobile,
       discountPercent:10,
       status:DiscountCouponStatus.ACTIVE,
       expireAtOrder:noOfOrders+5+1
    };
    return await this.discountCouponModelHelper.createDiscountCoupon(couponObj)
    }
}
