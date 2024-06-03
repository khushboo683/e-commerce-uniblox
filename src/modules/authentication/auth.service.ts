import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/common/constants/roles';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserModelHelperService,
    private jwtService: JwtService,
  ) {}

  async validateUser(mobile: string, password: string): Promise<any> {
    const user = await this.usersService.findUserWithMobile(mobile);
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { mobile: user.mobile, role: Roles.USER };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async adminLogin(admin: any) {
    const payload = { mobile: admin.mobile, role: Roles.ADMIN };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: any) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    console.log("hashed paswword", hashedPassword)
    return this.usersService.createUser({ ...user, password: hashedPassword });
  }
}
