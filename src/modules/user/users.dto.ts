import { IsOptional, IsString } from "class-validator"

export class OrderCheckoutDto{

    @IsString()
    mobile:string

    @IsString()
    @IsOptional()
    couponCode?:string
}