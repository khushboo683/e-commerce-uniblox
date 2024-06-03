import { Module } from "@nestjs/common";
import { ProductModelHelperService } from "./product-model-helper.service";

@Module({
  providers:[ProductModelHelperService],
  exports:[ProductModelHelperService]
})
export class ProductModelHelper{}