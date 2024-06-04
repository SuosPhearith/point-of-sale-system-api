import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('api/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  create(@Body() createCustomerDto: CreateCustomerDto, @Req() { user }) {
    return this.customerService.create(createCustomerDto, user);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('key') key: string = '',
  ) {
    return this.customerService.findAll(page, pageSize, key);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  findOne(@Param('id') id: number) {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(AuthenticationGuard)
  toggleActive(@Param('id') id: number) {
    return this.customerService.toggleActive(+id);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  remove(@Param('id') id: number) {
    return this.customerService.remove(+id);
  }
}
