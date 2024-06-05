import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { USER_MODEL } from 'src/common/database/database.constants';
import { IOrder } from 'src/common/database/orders.model';
import { User } from 'src/common/database/user.model';

@Injectable()
export class UserModelHelperService {
  findOne(arg0: { mobile: string; }) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @Inject(USER_MODEL)
    private userModel: Model<User>,
  ) {}

  async createUser(input: any) {
    return await this.userModel.create(input);
  }
  async findUserWithMobile(mobile:string){
return await this.userModel.findOne({mobile});
  }
  async updateAfterOrder(order:IOrder){
    const {userId} = order
    const updateBody=
      { $push: { orders: order }, $set: {cart: {}} }
    
    return await this.userModel.findOneAndUpdate(
      {userId},updateBody
    )
  }
}
