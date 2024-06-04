import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/constants/roles';
import { Role } from 'src/common/guard/roles.decorator';
import { AuthService } from '../authentication/auth.service';
import { UserAuthGuard } from 'src/common/guard/user-auth.guard';
import httpContext = require("express-http-context");
import { OrderCheckoutDto } from './users.dto';

@Role(Roles.USER)
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ){}
    @UseGuards(UserAuthGuard)
    @Post('/login')
    async userLogin(@Body() body:any){
        const user = await this.authService.validateUser(body.mobile, body.password);
        if (user) {
          return this.authService.login(user);
        }
        return { message: 'Invalid credentials' };
    }
    // @UseGuards(UserAuthGuard)
    @Get('/me')
    async getAllUsers(@Body() body:any){
        const result = await this.userService.getUserDetails(body);
        return result;
    }
    @Post('/register')
    async createUser(@Body() body:any){
        return await this.authService.register(body);
    }

    @Patch('/cart')
    async updateCart(@Body() body:any){
        return await this.userService.updateCart(body)
    }
    
    @Get('/coupon')
    async fetchActiveCoupon(@Body() body:any){
      return await this.userService.fetchCoupon(body)
    }

    @Post('/checkout')
    async order(@Body() body:OrderCheckoutDto){
     return await this.userService.checkout(body);
    }

}
