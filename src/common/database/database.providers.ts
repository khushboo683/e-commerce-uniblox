import mongoose, { Connection, ConnectOptions } from 'mongoose';
import {
    ADMIN_MODEL,
  DATABASE_CONNECTION,
 USER_MODEL,
 PRODUCT_MODEL,
 ORDER_MODEL,
 DISCOUNT_COUPON_MODEL
} from "./database.constants";
import { User, UserSchema } from './user.model';
import { Admin, AdminSchema } from './admin.model';
import { IProduct, ProductSchema } from './product.model';
import { IOrder, OrderSchema } from './orders.model';
import { DiscountCouponSchema, IDiscountCoupon } from './discount-coupons.model';


export const databaseProviders=[
    {
        provide: DATABASE_CONNECTION,
        useFactory: (): Connection => {
          // eslint-disable-next-line no-console
          console.log(`DB URL ${process.env.DATABASE_URL}`);
          const connection = mongoose.createConnection(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          } as ConnectOptions);
    
          connection.on('connected', () => {
            // eslint-disable-next-line no-console
            console.log('DB Connected');
          });
    
          connection.on('error', (err) => {
            // eslint-disable-next-line no-console
            console.log('Failed to connect DB');
            // eslint-disable-next-line no-console
            console.error(JSON.stringify(err));
          });
    
          return connection;
        },
        inject: []
      },
      {
        provide: USER_MODEL,
        useFactory: (connection: mongoose.Connection) => {
          const userModel = connection.model<User>(
            "User",
            UserSchema,
            "user")
          if (true) {
            userModel.syncIndexes();
          }
          return userModel;
        },
        inject: [DATABASE_CONNECTION]
      },
      {
        provide: ADMIN_MODEL,
        useFactory: (connection: mongoose.Connection) => {
          const adminModel = connection.model<Admin>(
            "Admin",
            AdminSchema,
            "admin")
          if (true) {
            adminModel.syncIndexes();
          }
          return adminModel;
        },
        inject: [DATABASE_CONNECTION]
      },
      {
        provide: PRODUCT_MODEL,
        useFactory: (connection: mongoose.Connection) => {
          const productModel = connection.model<IProduct>(
            "Product",
            ProductSchema,
            "product")
          if (true) {
            productModel.syncIndexes();
          }
          return productModel;
        },
        inject: [DATABASE_CONNECTION]
      },
      {
        provide: ORDER_MODEL,
        useFactory: (connection: mongoose.Connection) => {
          const orderModel = connection.model<IOrder>(
            "Order",
            OrderSchema,
            "order")
          if (true) {
            orderModel.syncIndexes();
          }
          return orderModel;
        },
        inject: [DATABASE_CONNECTION]
      },
      {
        provide: DISCOUNT_COUPON_MODEL,
        useFactory: (connection: mongoose.Connection) => {
          const discountCouponModel = connection.model<IDiscountCoupon>(
            "DiscountCoupon",
            DiscountCouponSchema,
            "discount_coupon")
          if (true) {
            discountCouponModel.syncIndexes();
          }
          return discountCouponModel;
        },
        inject: [DATABASE_CONNECTION]
      },
]