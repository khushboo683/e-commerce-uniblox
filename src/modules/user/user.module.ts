import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModelHelperModule } from '../model-helper/user-model-helper/user-model-helper.module';
import { AuthModule } from '../authentication/auth.module';
import { ProductModelHelper } from '../model-helper/product-model-helper/product-model-helper.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports:[UserModelHelperModule, AuthModule, ProductModelHelper]
})
export class UserModule {}
