import { Injectable } from '@nestjs/common';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';
import { OrderModelHelperService } from '../model-helper/order-model-helper/order-model-helper.service';
import { OrderStatus } from 'src/common/constants/order-status';
import { ProductModelHelper } from '../model-helper/product-model-helper/product-model-helper.module';
import { ProductModelHelperService } from '../model-helper/product-model-helper/product-model-helper.service';

@Injectable()
export class AdminService {
    constructor(
        private userModelHelper: UserModelHelperService,
        private orderModelHelper: OrderModelHelperService,
        private productModelHelper:ProductModelHelperService
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
}
