import { HttpModule, Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { PassportModule } from '@nestjs/passport';
import { UploadService } from './upload.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {
}
