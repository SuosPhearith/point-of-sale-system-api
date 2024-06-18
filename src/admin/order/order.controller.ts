import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { Role } from 'src/global/enum/role.enum';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization/authorization.guard';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('getAllProducts')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  getAllProducts(@Query('key') key: string = '') {
    return this.orderService.getAllProducts(key);
  }

  @Get('getAllCustomers')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  getAllCustomers() {
    return this.orderService.getAllCustomers();
  }
}
