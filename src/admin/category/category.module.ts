import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FileUploadModule } from 'src/file/file-upload.module';

@Module({
  imports: [AuthModule, FileUploadModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
