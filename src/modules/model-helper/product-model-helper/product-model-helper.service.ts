import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { PRODUCT_MODEL } from "src/common/database/database.constants";
import { IProduct } from "src/common/database/product.model";

@Injectable()
export class ProductModelHelperService{
    constructor(
        @Inject(PRODUCT_MODEL)
        private productModel:Model<IProduct>
    ){}
async getProductDetails(productId:string){
    return await this.productModel.findOne({_id:productId})
}
async createProduct(body:any){
    return await this.productModel.create(body);
}
}