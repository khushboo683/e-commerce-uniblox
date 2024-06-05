import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Admin } from "src/common/database/admin.model";
import { ADMIN_MODEL } from "src/common/database/database.constants";
import { UserRegisterDto } from "src/modules/user/users.dto";

@Injectable()
export class AdminModelHelperService{
    constructor(
        @Inject(ADMIN_MODEL)
        private adminModel:Model<Admin>
    ){}

    async createAdmin(body:UserRegisterDto){
     return await this.adminModel.create(body)
    }
    async findAdmin(mobile:string){
        return await this.adminModel.findOne({mobile})
    }
}