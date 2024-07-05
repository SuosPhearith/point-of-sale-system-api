import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
//::===============================================work

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('getAllProducts')
  @UseGuards(AuthenticationGuard)
  getAllProducts(
    @Query('key') key: string = '',
    @Query('catKey') catKey: string = '',
  ) {
    return this.orderService.getAllProducts(key, catKey);
  }

  @Get('getAllCategories')
  @UseGuards(AuthenticationGuard)
  getAllCategories() {
    return this.orderService.getAllCategories();
  }

  @Get('getAllCustomers')
  @UseGuards(AuthenticationGuard)
  getAllCustomers() {
    return this.orderService.getAllCustomers();
  }
}
