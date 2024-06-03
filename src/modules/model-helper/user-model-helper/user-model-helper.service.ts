import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { USER_MODEL } from 'src/common/database/database.constants';
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
  async getUsers(){
    return await this.userModel.find();
  }
  async findUserWithMobile(mobile:string){
return await this.userModel.findOne({mobile});
  }
}
