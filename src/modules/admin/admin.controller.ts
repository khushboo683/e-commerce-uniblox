import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/common/constants/roles';
import { Role } from 'src/common/guard/roles.decorator';
import { AdminService } from './admin.service';
import { AuthService } from '../authentication/auth.service';
import { AdminLoginDto, AdminRegisterDto } from '../authentication/auth.dto';
import { UserDto, UserLoginDto, UserRegisterDto } from '../user/users.dto';
@Role(Roles.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
  ) {}

  @Post('/login')
  async adminLogin(@Body() body: UserLoginDto) {
    try {
      return await this.authService.login(body);
    } catch (err) {
      console.log('Error while loggin in:', err);
      throw err;
    }
  }
  @Post('/register')
  async adminRegister(@Body() body: UserRegisterDto) {
    try{
     return await this.authService.register(body)
    }catch(err){
        console.log("Something went wrong while registering admin:", err)
        throw err
    }
  }
  @Get('/user-stats')
  async getUserStats(@Body() body:any) {
    try{
     return await this.adminService.getUserStats(body)
    }catch(err){
        console.log("Error fetching user stats:", err)
        throw err
    }
  }


  @Post('/discount-coupon')
  async generateDiscountCoupon(@Body() body: UserDto) {
    try{
        return await this.adminService.generateCoupon(body);
    }catch(err){
        console.log("Errpr fetching coupon:",err)
        throw err
    }
   
  }
}
