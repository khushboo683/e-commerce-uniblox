import { IsEnum, IsString } from "class-validator"
import { Roles } from "src/common/constants/roles"

export class AdminLoginDto{
    @IsString()
    mobile:string

    @IsString()
    password:string
}
export class AdminRegisterDto extends AdminLoginDto{
 
    @IsString()
    email:string

    @IsEnum(Roles)
    role:Roles
}