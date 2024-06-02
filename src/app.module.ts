import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModelHelperModule } from './modules/model-helper/user-model-helper/user-model-helper.module';
import { DatabaseModule } from './common/database/database.module';
import { JwtMiddleware } from './common/middleware/jwt.middleware';


@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.DATABASE_URL), 
    UserModule,
    AdminModule,
    UserModelHelperModule,
    DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        { path: 'user', method: RequestMethod.ALL },
      );
  }
}
