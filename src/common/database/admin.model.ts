import {Document, Schema} from 'mongoose';
import { Roles } from '../constants/roles';
interface Admin extends Document{
    name: string,
    email: string,
    mobile: string,
    password: string,
    role:Roles
}
const AdminSchema = new Schema({
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
    Admin,
    AdminSchema
  }