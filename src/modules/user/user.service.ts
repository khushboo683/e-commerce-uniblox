import { Injectable } from '@nestjs/common';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';

@Injectable()
export class UserService {
    constructor(
        private userModelHelper: UserModelHelperService
    ){}

    async createUser(input:any){
        
       return await this.userModelHelper.createUser(input);
    }
   async getUserDetails(){

   }
}
