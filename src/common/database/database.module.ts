import { Global, Module } from "@nestjs/common";
import { databaseProviders } from "./database.providers";
/**
 * Reference for the DB setup in the NestJS Project : https://github.com/jmcdo29/nestjs-sample
 *
 * @export
 * @class DatabaseModule
 */
@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule {}
