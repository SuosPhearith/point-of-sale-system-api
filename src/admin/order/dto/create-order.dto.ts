import { IsNotEmpty } from 'class-validator';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  discount: number;
  finalPrice: number;
  stock: number;
  image: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  readonly items: OrderItem[];

  @IsNotEmpty()
  readonly customerId: number;
}
