import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FileUploadModule } from 'src/file/file-upload.module';

@Module({
  imports: [AuthModule, FileUploadModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
