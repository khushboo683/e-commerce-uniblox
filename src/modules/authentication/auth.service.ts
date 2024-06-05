import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';
import * as bcrypt from 'bcrypt';
import { UserLoginDto, UserRegisterDto } from '../user/users.dto';
import { Roles } from 'src/common/constants/roles';
import { AdminService } from '../admin/admin.service';
import { AdminModelHelperService } from '../model-helper/admin-model-helper/admin-model-helper.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserModelHelperService,
    private jwtService: JwtService,
    private adminService:AdminModelHelperService
  ) {}

  async login(body: UserLoginDto) { 
    const{mobile} = body
    const user = await this.usersService.findUserWithMobile(mobile);
    
    if (!user) {
      throw new Error('User not registered');
    }
    console.log('Login body password:', body.password); // Log the password from the body
    console.log('User password:', user); 
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return {
      access_token: this.jwtService.sign({ mobile,role:user.role}),
    };
  }
  async adminLogin(body: UserLoginDto) { 
    const{mobile} = body
    const user = await this.adminService.findAdmin(mobile)
    
    if (!user) {
      throw new Error('User not registered');
    } 
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return {
      access_token: this.jwtService.sign({ mobile,role:user.role}),
    };
  }

  async register(user: UserRegisterDto) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
      switch(user.role){
        case Roles.USER:
          return this.usersService.createUser({ ...user, password: hashedPassword });
        case Roles.ADMIN:
          return this.adminService.createAdmin({...user,password:hashedPassword}) 
      }
       
    
  }
}
