import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/constants/roles';
import { Role } from 'src/common/guard/roles.decorator';
import { AuthService } from '../authentication/auth.service';
import { UserAuthGuard } from 'src/common/guard/user-auth.guard';
import {OrderCheckoutDto, UpdateCartDto, UserDto, UserLoginDto, UserRegisterDto } from './users.dto';

@Role(Roles.USER)
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ){}
    @UseGuards(UserAuthGuard)
    @Post('/login')
    async userLogin(@Body() body:UserLoginDto){
        try{
            const user = await this.authService.login(body);
        }catch(err){
           console.log("Error while logging in:", err)
           throw err
        }
 
    }
    // @UseGuards(UserAuthGuard)
    @Get('/me')
    async getAllUsers(@Body() body:UserDto){
        try{  
            const result = await this.userService.getUserDetails(body);
            return result;

        }catch(err){
            console.log("Error fetching user details:",err)
            throw err
        }
      
    }
    @Post('/register')
    async createUser(@Body() body:UserRegisterDto){
        try{
            return await this.authService.register(body);
        }catch(err){
            console.log("Something went wrong while registering!", err)
            throw err
        }
     
    }

    @Patch('/cart')
    async updateCart(@Body() body:UpdateCartDto){
        try{
            return await this.userService.updateCart(body)
        }catch(err){
            console.log("Error while updating the cart:", err)
            throw err
        }
        
    }
    
    @Get('/coupon')
    async fetchActiveCoupon(@Body() body:UserDto){
        try{
            return await this.userService.fetchCoupon(body)
        }catch(err){
         console.log("Error while fetching coupon:", err)
         throw err
        }
    }

    @Post('/checkout')
    async order(@Body() body:OrderCheckoutDto){
        try{
            return await this.userService.checkout(body);
        }catch(err){
            console.log("Error while checking out the order:", err)
            throw err
        }
     
    }

}
