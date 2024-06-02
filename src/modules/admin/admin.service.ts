import { Injectable } from '@nestjs/common';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';

@Injectable()
export class AdminService {
    constructor(
        private userModelHelper: UserModelHelperService
    ){}

    async getUsers(){
        return await this.userModelHelper.getUsers();
    }

    async getUserDetails(){
        
    }
}
