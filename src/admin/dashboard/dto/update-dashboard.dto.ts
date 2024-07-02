import { IsNotEmpty } from 'class-validator';

export class UpdateDashboardDto {
  @IsNotEmpty()
  readonly achievedSales: number;

  @IsNotEmpty()
  readonly achievedSalesToday: number;

  @IsNotEmpty()
  readonly achievedCustomers: number;
}
