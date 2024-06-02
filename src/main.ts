import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix( "uniblox");
  await app.listen(3000);
  console.log(`app listening on port 3000`)
  console.log(`DATABASE_URL -> ${process.env.DATABASE_URL}`);
}
bootstrap();
