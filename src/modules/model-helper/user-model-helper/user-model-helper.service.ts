import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { USER_MODEL } from '../../../common/database/database.constants';
import { IOrder } from 'src/common/database/orders.model';
import { ICart, User } from 'src/common/database/user.model';

@Injectable()
export class UserModelHelperService {
  constructor(
    @Inject(USER_MODEL)
    private userModel: Model<User>,
  ) {}

  async createUser(input: any) {
    return await this.userModel.create(input);
  }
  async findUserWithMobile(mobile:string):Promise<User>{
   return await this.userModel.findOne({mobile});
  }
  async updateAfterOrder(order:IOrder){
    const {userId} = order
    const updateBody=
      { $push: { orders: order }, $set: {cart: {}} }
    
    return await this.userModel.findOneAndUpdate(
      {mobile:userId},updateBody,{new:true}
    )
  }

  async getUserStats(mobile:string):Promise<{ totalItemsPurchased: number, totalAmount: number, totalDiscountSum:number }>{
    const result = await this.userModel.aggregate([
      { $match: { mobile: mobile } },
      { $unwind: '$orders' },
      { $unwind: '$orders.productList' },
      {
        $group: {
          _id: '$_.id',
          totalItemsPurchased: { $sum: '$orders.productList.count' },
          totalAmount: { $sum: '$orders.totalAmount' },
          totalDiscountSum: {
            $sum: {
              $multiply: [
                { $divide: [{ $ifNull: ['$orders.discount', 0] }, 100] },
                '$orders.totalAmount'
              ]
            }
          }
        }
      }
    ]);

    if (result.length === 0) {
      return { totalItemsPurchased: 0, totalAmount: 0, totalDiscountSum:0};
    }

    const { totalItemsPurchased, totalAmount, totalDiscountSum } = result[0];
    return { totalItemsPurchased, totalAmount , totalDiscountSum};
  }

  async updateCart(cart:ICart,mobile:string){
    return await this.userModel.updateOne(
      { mobile },
      { $set: { cart} }
  );
  }
}
