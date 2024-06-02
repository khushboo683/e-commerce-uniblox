import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/constants/roles';
import { Role } from 'src/common/guard/roles.decorator';
import { AuthService } from '../authentication/auth.service';
import { UserAuthGuard } from 'src/common/guard/user-auth.guard';


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
    async getAllUsers(){
        const result = await this.userService.getUserDetails();
        return result;
    }


    @Post('/register')
    async createUser(@Body() body:any){
        return await this.authService.register(body);
    }

}
