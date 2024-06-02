import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModelHelperModule } from "../model-helper/user-model-helper/user-model-helper.module";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule} from "@nestjs/config";
import { JwtMiddleware } from "src/common/middleware/jwt.middleware";

@Module({
  providers:[AuthService, JwtMiddleware],
  exports:[AuthService, JwtMiddleware],
  imports:[UserModelHelperModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async () => ({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
        inject: [],
      }),
  ]
})
export class AuthModule{}