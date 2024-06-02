import {Document, Schema} from 'mongoose';
import { Roles } from '../constants/roles';
interface User extends Document{
    name: string,
    email: string,
    mobile: string,
    password: string,
    role:Roles
}
const UserSchema = new Schema({
    name: String,
    email: String,
    mobile: String,
    password: String,
    role: {
        type: String,
        enum: Object.values(Roles),
    }
    
  },{timestamps:true});

  export {
    User,
    UserSchema
  }