import { Module } from "@nestjs/common";
import { OrderModelHelperService } from "./order-model-helper.service";

@Module({
    providers:[OrderModelHelperService],
    exports:[OrderModelHelperService]
})
export class OrderModelHelper{}