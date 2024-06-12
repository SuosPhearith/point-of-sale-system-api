import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseCreateOrUpdateDTO } from 'src/global/dto/response.create.update.dto';
import axios from 'axios';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  formatOrderMessageAsInvoice(
    order: CreateOrderDto,
    totalPrice: number,
  ): string {
    let message = `============>> Invoice <<============\n`;
    message += `Customer ID:${order.customerId} \n\n`;
    message += `============>> Items <<=============\n`;

    order.items.forEach((item) => {
      const finalPrice = (item.finalPrice * item.qty).toFixed(2);
      message += `${item.name} - $${item.price.toFixed(2)} x ${item.qty} = $${finalPrice}\n`;
    });
    message += `===================================\n`;

    message += `\nTotal Price:$${totalPrice.toFixed(2)}`;

    return message;
  }
  async sendMessageToTelegramBot(
    botToken: string,
    chatId: string,
    message: string,
  ): Promise<any> {
    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });
    } catch (error) {
      throw error;
    }
  }
  async create(
    createOrderDto: CreateOrderDto,
  ): Promise<ResponseCreateOrUpdateDTO> {
    try {
      const items = createOrderDto.items;
      let totalPrice = 0;
      let totalItem = 0;
      for (const item of items) {
        totalPrice += item.finalPrice * item.qty;
        totalItem += item.qty;
      }
      // store in order
      const order = await this.prisma.order.create({
        data: {
          totalPrice,
          totalItem,
          customerId: createOrderDto.customerId,
        },
      });
      // store order detail
      for (const item of items) {
        const { id, price, discount, finalPrice, qty: quantity } = item;
        await this.prisma.orderDetail.create({
          data: {
            orderId: order.id,
            productId: id,
            price,
            discount,
            finalPrice,
            quantity,
            totalPrice: finalPrice * quantity,
          },
        });
        await this.prisma.product.update({
          where: { id },
          data: {
            stock: { decrement: quantity },
          },
        });
      }
      // send notification to telegram
      const message = this.formatOrderMessageAsInvoice(
        createOrderDto,
        totalPrice,
      );
      this.sendMessageToTelegramBot(
        process.env.TELEGRAM_BOT_TOKEN,
        process.env.TELEGRAM_CHAT_ID,
        message,
      );
      return {
        data: order,
        message: 'Ordered successfully',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllCustomers() {
    try {
      const customerList = await this.prisma.customer.findMany({
        where: { status: true },
        select: {
          id: true,
          name: true,
        },
      });
      // format response
      const customers = customerList.map((c) => ({
        value: c.id,
        label: c.name,
      }));
      return customers;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts(key: string) {
    try {
      const where: any = { status: true, stock: { gt: 0 } };
      if (key) {
        where.OR = [{ name: { contains: key, mode: 'insensitive' } }];
      }
      const productList = await this.prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          discount: true,
          image: true,
        },
      });
      // format data before response
      const products = productList.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        finalPrice: +p.price * (1 - +p.discount / 100),
        discount: p.discount,
        image: p.image,
        stock: p.stock,
      }));
      // response back
      return products;
    } catch (error) {
      throw error;
    }
  }
}
