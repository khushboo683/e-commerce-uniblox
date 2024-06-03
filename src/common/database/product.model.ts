import {Document, Schema} from 'mongoose';
interface IProduct extends Document{
    name: string,
    _id: string,
    price: number,
    desc: string,
    inStock: boolean,
    imageUrl:string
}
const ProductSchema = new Schema<IProduct>({
    name: String,
    _id:String,
    price: Number,
    desc: String,
    inStock:Boolean,
    imageUrl: String
    
  },{timestamps:true});

  export {
    IProduct,
    ProductSchema
  }