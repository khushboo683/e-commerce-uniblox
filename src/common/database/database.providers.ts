import mongoose, { Connection, ConnectOptions } from 'mongoose';
import {
  DATABASE_CONNECTION,
 USER_MODEL,
} from "./database.constants";
import { User, UserSchema } from './user.model';


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
]