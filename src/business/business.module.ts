import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { BusinessSchema } from './business.model';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Business', schema: BusinessSchema}]),
   PassportModule.register({defaultStrategy: 'jwt'})],
  providers: [BusinessService],
  controllers: [BusinessController]
})
export class BusinessModule {}
