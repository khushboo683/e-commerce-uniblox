import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModelHelperModule } from '../model-helper/user-model-helper/user-model-helper.module';
import { AuthModule } from '../authentication/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports:[UserModelHelperModule, AuthModule]
})
export class UserModule {}
