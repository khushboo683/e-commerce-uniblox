import { Module } from "@nestjs/common";
import { UserModelHelperService } from "./user-model-helper.service";

@Module(
    {
        providers:[UserModelHelperService],
        exports:[UserModelHelperService]
    }
)
export class UserModelHelperModule {}