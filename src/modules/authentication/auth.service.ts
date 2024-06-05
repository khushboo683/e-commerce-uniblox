import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/common/constants/roles';
import { UserLoginDto, UserRegisterDto } from '../user/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserModelHelperService,
    private jwtService: JwtService,
  ) {}

  async login(body: UserLoginDto) { 
    const{mobile} = body
    const user = await this.usersService.findUserWithMobile(mobile);
    
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
    return this.usersService.createUser({ ...user, password: hashedPassword });
  }
}
