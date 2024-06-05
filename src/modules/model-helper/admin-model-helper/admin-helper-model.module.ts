import { Module } from "@nestjs/common";
import { AdminModelHelperService } from "./admin-model-helper.service";

@Module({
    providers:[AdminModelHelperService],
    exports:[AdminModelHelperService]
})
export class AdminModelHelperModule{}