import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/constants/roles';
import { Role } from 'src/common/guard/roles.decorator';
import { AuthService } from '../authentication/auth.service';
import { UserAuthGuard } from 'src/common/guard/user-auth.guard';
import httpContext = require("express-http-context");

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
    @UseGuards(UserAuthGuard)
    @Get('/me')
    async getAllUsers(@Param('mobile') mobile:string){
        const result = await this.userService.getUserDetails(mobile);
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

    @Post('/checkout')
    async order(@Body() body:any){
     return await this.userService.checkout(body);
    }

}
