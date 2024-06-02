import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModelHelperModule } from '../model-helper/user-model-helper/user-model-helper.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports:[UserModelHelperModule]
})
export class AdminModule {}
