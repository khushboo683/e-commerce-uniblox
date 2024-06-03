import { Injectable } from '@nestjs/common';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';
import { Roles } from 'src/common/constants/roles';
import { CartActions } from 'src/common/constants/cart-actions';
import { User, ICart } from 'src/common/database/user.model';
import { ProductModelHelperService } from '../model-helper/product-model-helper/product-model-helper.service';
import { IProduct } from 'src/common/database/product.model';

@Injectable()
export class UserService {
    constructor(
        private userModelHelper: UserModelHelperService,
        private productModelHelper: ProductModelHelperService
    ){}

    async createUser(input:any){
        input={...input,role:Roles.USER}
       return await this.userModelHelper.createUser(input);
    }
   async getUserDetails(mobile:string){
     return  this.userModelHelper.findUserWithMobile(mobile)
   }
   async updateCart(input: any) {
    const { action, productId, mobile } = input;

    // Fetch the user
    const user= await this.getUserDetails(mobile);

    if (!user) {
      throw new Error('User not found');
    }

    const itemIndex = user.cart?.productDetails.findIndex((item) => item.productId === productId);
    const product:IProduct = await this.productModelHelper.getProductDetails(productId)

    switch (action) {
      case CartActions.ADD:
   
        if(!product){
            throw new Error('Product does not exist')
        }
        if(product?.inStock==false){
            throw new Error('Product sold out')
        }else{
            const prodObj:any={
                productDetails:{
                    productId:product?._id,
                    productName: product?.name,
                    count:1
                } ,
               
                cartValue:product?.price,
             
            }
            if (itemIndex > -1) {
                // If the item already exists, increment the count
                user.cart.productDetails[itemIndex].count += 1;
       
              } else {
                // If the item does not exist, add it with count 1
                user.cart.productDetails.push(prodObj.productDetails);
              }
              user.cart.cartValue+=product?.price;
        }
       
        break;

      case CartActions.REMOVE:
        if (itemIndex > -1) {
          // If the item exists, remove it
          const amount=user.cart.productDetails[itemIndex].count*product?.price
          user.cart.cartValue-=amount
          user.cart.productDetails.splice(itemIndex, 1);
        } else {
          throw new Error('Product not found in cart');
        }
        break;

      case CartActions.DECREASE:
        if (itemIndex > -1) {
          // If the item exists and count is more than 1, decrement the count
          if (user.cart.productDetails[itemIndex].count > 1) {
            user.cart.productDetails[itemIndex].count -= 1;
          } else {
            // If the count is 1, remove the item
            user.cart.productDetails.splice(itemIndex, 1);
          }
          user.cart.cartValue-=product?.price
        } else {
          throw new Error('Product not found in cart');
        }
        break;

      default:
        throw new Error('Invalid cart action');
    }

    // Save the updated user
    await user.save();
    return user.cart;
  }
}
