import { Module,} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './users.model';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../utils/jwt.strategy';
import { globalConfig } from '../utils/app-service-data';
import { AuthService } from '../utils/auth.service';
import { UploadService } from '../upload/upload.service';
import { ProductsSchema } from '../products/products.model';
import { CategoriesSchema } from '../categories/categories.model';
import { OrderSchema } from '../order/order.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }, {
      name: 'Products',
      schema: ProductsSchema,
    }, { name: 'Categories', schema: CategoriesSchema }, { name: 'Orders', schema: OrderSchema }]),
    JwtModule.register({
      secret: globalConfig.secret,
      signOptions: {
        expiresIn: '3h',
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, AuthService, UploadService],
  exports: [PassportModule, JwtStrategy],
})
export class UsersModule {

}
