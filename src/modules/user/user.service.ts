import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';
import { Roles } from 'src/common/constants/roles';
import { CartActions } from 'src/common/constants/cart-actions';
import { ICart, User } from 'src/common/database/user.model';
import { ProductModelHelperService } from '../model-helper/product-model-helper/product-model-helper.service';
import { IProduct } from 'src/common/database/product.model';
import { OrderModelHelperService } from '../model-helper/order-model-helper/order-model-helper.service';
import { OrderStatus } from 'src/common/constants/order-status';
import { DiscountCouponModelHelperService } from '../model-helper/discount-coupon-model-helper/discount-coupon-model-helper.service';
import { DiscountCouponStatus } from 'src/common/constants/discount-coupon-status';
import { IDiscountCoupon } from 'src/common/database/discount-coupons.model';
import { OrderCheckoutDto, UpdateCartDto, UserDto } from './users.dto';
import { IOrder } from 'src/common/database/orders.model';

@Injectable()
export class UserService {
    constructor(
        private userModelHelper: UserModelHelperService,
        private productModelHelper: ProductModelHelperService,
        private orderModelHelper: OrderModelHelperService,
        private discountCouponModelHelper: DiscountCouponModelHelperService
    ){}

    async createUser(input:any){
        input={...input,role:Roles.USER}
       return await this.userModelHelper.createUser(input);
    }
   async getUserDetails(body:UserDto){
    const {mobile}=body;
     return  this.userModelHelper.findUserWithMobile(mobile)
   }
   async updateCart(input: UpdateCartDto) {
    const { action, productId, mobile } = input;

    // Fetch the user
    const user= await this.getUserDetails({mobile});
    if (!user) {
        throw new NotFoundException("User does not exist")
    }
    let itemIndex=-1
    if(user.cart )
     itemIndex=user?.cart?.productList?.findIndex((item) => item.productId === productId);
    const product:IProduct = await this.productModelHelper.getProductDetails(productId)

    switch (action) {
      case CartActions.ADD:
   
        if(!product){
            throw new BadRequestException('Product does not exist')
        }
        if(product?.inStock==false){
            throw new BadRequestException('Product sold out')
        }else{
            const prodObj:ICart={
                productList:[{
                    productId:product?._id,
                    productName: product?.name,
                    count:1
                } ],
               
                cartValue:Number(product?.price),
             
            }
            if (itemIndex > -1) {
                // If the item already exists, increment the count
                user.cart.productList[itemIndex].count += 1;
       
              } else {
                // If the item does not exist, add it with count 1
                user.cart.productList.push(...prodObj.productList);
              }
              user.cart.cartValue+=product?.price;
      
        }
       
        break;

      case CartActions.REMOVE:
        if (itemIndex > -1) {
          // If the item exists, remove it
          const amount=user.cart.productList[itemIndex].count*product?.price
          user.cart.cartValue-=amount
          user.cart.productList.splice(itemIndex, 1);
        } else {
          throw new BadRequestException('Product not found in cart');
        }
        break;

      case CartActions.DECREASE:
        if (itemIndex > -1) {
          // If the item exists and count is more than 1, decrement the count
          if (user.cart.productList[itemIndex].count > 1) {
            user.cart.productList[itemIndex].count -= 1;
          } else {
            // If the count is 1, remove the item
            user.cart.productList.splice(itemIndex, 1);
          }
          user.cart.cartValue-=product?.price
        } else {
          throw new BadRequestException('Product not found in cart');
        }
        break;

      default:
        throw new BadRequestException('Invalid cart action');
    }
    await this.userModelHelper.updateCart(user.cart,mobile)
    return user;
  }
  async updateUserAfterOrder(order:IOrder){
   return await this.userModelHelper.updateAfterOrder(order)
  }

  async fetchCoupon(body:UserDto){
    const {mobile} = body
    const query={
      userId:mobile,
      status:DiscountCouponStatus.ACTIVE
  }
    const user = await this.getUserDetails(body)
    if((user?.orders.length+1)%5==0)
    return await this.discountCouponModelHelper.fetchCoupon(query)
  else throw new BadRequestException("User is not elegible for a coupon")
  }
  async checkout(body:OrderCheckoutDto){
    const {mobile} = body
    const user:User = await this.getUserDetails(body)
    if(user.cart.productList.length<=0){
        throw new BadRequestException('Cart is empty')
    }
    else {
        let orderObj:IOrder
        let couponFromDb:IDiscountCoupon;
        let finalTotalAmt=user?.cart?.cartValue;
        if((user.orders.length+1)%5==0){
            await this.discountCouponModelHelper.deactivateExpiredCopons(user.orders.length,mobile);
        }
        if(body?.couponCode){
          const query={
            userId:mobile,
            code:body?.couponCode
          }
          couponFromDb=await this.discountCouponModelHelper.fetchCoupon(query)
          if(couponFromDb?.code!==body?.couponCode){
            throw new BadRequestException("Coupon applied is not valid")
          }
          finalTotalAmt-=(((couponFromDb?.discountPercent||100)/100)*user?.cart?.cartValue)
          await this.discountCouponModelHelper.markDiscountCouponUsed(mobile)
        }
        const productList:Record<string,any>[]=[];
         user?.cart?.productList?.forEach((p) => {
            productList.push(p);
        });
        orderObj={
            userId: user?.mobile,
            productList,
            status: OrderStatus.ORDERED,
            totalAmount:user?.cart?.cartValue,
            discount: couponFromDb?.discountPercent??0,
            totalAmountAfterDiscount:finalTotalAmt
        }
    const order=await this.orderModelHelper.createOrder(orderObj)
    return await this.updateUserAfterOrder(orderObj);
    }
  }
}
