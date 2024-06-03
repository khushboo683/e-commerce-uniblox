import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModelHelperModule } from '../model-helper/user-model-helper/user-model-helper.module';
import { AuthModule } from '../authentication/auth.module';
import { OrderModelHelper } from '../model-helper/order-model-helper/order-model-helper.module';
import { ProductModelHelper } from '../model-helper/product-model-helper/product-model-helper.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports:[UserModelHelperModule, AuthModule, OrderModelHelper, ProductModelHelper]
})
export class AdminModule {}
