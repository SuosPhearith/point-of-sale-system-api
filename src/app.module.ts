import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtService } from './auth/jwt.service';
import { EmployeeModule } from './admin/employee/employee.module';
import { AdminModule } from './admin/admin/admin.module';
import { FileUploadModule } from './file/file-upload.module';
import { CustomerModule } from './admin/customer/customer.module';
import { CategoryModule } from './admin/category/category.module';
import { ProductModule } from './admin/product/product.module';
import { OrderModule } from './admin/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    EmployeeModule,
    AdminModule,
    FileUploadModule,
    CustomerModule,
    CategoryModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService],
})
export class AppModule {}
