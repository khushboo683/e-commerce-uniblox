import { IsEnum, IsOptional, IsString } from "class-validator"
import { CartActions } from "src/common/constants/cart-actions"
import { Roles } from "src/common/constants/roles"

export class UserDto{
    @IsString()
    mobile:string
}
export class UserLoginDto extends UserDto{

    @IsString()
    password: string
}
export class UserRegisterDto extends UserLoginDto{

    @IsString()
    name: string

    @IsString()
    @IsOptional()
    email?:string

    @IsEnum(Roles)
    role:Roles
}
export class OrderCheckoutDto extends UserDto{

    @IsString()
    @IsOptional()
    couponCode?:string
}
export class UpdateCartDto extends UserDto{

    @IsEnum(CartActions)
    action:CartActions

    @IsString()
    productId:string
}