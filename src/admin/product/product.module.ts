import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FileUploadModule } from 'src/file/file-upload.module';

@Module({
  imports: [AuthModule, FileUploadModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
