import {Document, Schema} from 'mongoose';
interface Product extends Document{
    name: string,
    price: number,
    desc: string
}
const ProductSchema = new Schema({
    name: String,
    price: Number,
    desc: String
    
  },{timestamps:true});

  export {
    Product,
    ProductSchema
  }