import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Roles } from 'src/common/constants/roles';
import { Role } from 'src/common/guard/roles.decorator';
import { AdminService } from './admin.service';
import { AuthService } from '../authentication/auth.service';
// @Role(Roles.ADMIN)
@Controller('admin')

export class AdminController {
    constructor(
        private adminService: AdminService,
        private authService: AuthService
    ){}

    @Post('/login')
    async adminLogin(@Body() body:any){
        return await this.authService.adminLogin(body);
    }

    @Get('/users')
    async allUsers(){
        return await this.adminService.getUsers();
    }

    @Get('/orders')
    async getOrdersList(){
        return await this.adminService.getOrdersList();
    }
    @Patch('/order-concel')
    async cancelOrder(@Param('id') id:string){
     return await this.adminService.cancelOrder(id);
    }
    @Post('/add-product')
    async addProduct(@Body() body:any){
        return await this.adminService.addNewProduct(body)
    }
    @Post('/discount-coupon')
    async generateDiscountCoupon(@Body() body:any){
        return await this.adminService.generateCoupon(body)
    }
}
