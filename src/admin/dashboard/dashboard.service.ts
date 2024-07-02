import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const achieved = await this.prisma.dashboard.findFirst({
        where: { id: 1 },
      });

      // Get total items sold today
      const totalItemsSoldTodayResult = await this.prisma.orderDetail.aggregate(
        {
          _sum: {
            quantity: true,
          },
          where: {
            order: {
              createdAt: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          },
        },
      );
      const totalItemsSoldToday = totalItemsSoldTodayResult._sum.quantity || 0;

      // Get total for sales today
      const totalSalesTodayResult = await this.prisma.order.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });
      const totalSalesToday = totalSalesTodayResult._sum.totalPrice || 0;
      // achieved for sales today
      const achievedTotalSalesToday =
        (+totalSalesToday / achieved.achievedSalesToday) * 100;

      // Get total sale
      const totalSalesResult = await this.prisma.order.aggregate({
        _sum: {
          totalPrice: true,
        },
      });
      const totalSales = totalSalesResult._sum.totalPrice || 0;
      // achieved for sales today
      const achievedTotalSales = (+totalSales / achieved.achievedSales) * 100;

      // Get total customer
      const totalCustomers = await this.prisma.customer.count();
      // achieved for total customer
      const achievedTotalCustomers =
        (+totalCustomers / achieved.achievedCustomers) * 100;

      return {
        totalSales: {
          amount: +totalSales || 0,
          achieved: +achievedTotalSales.toFixed(2) || 0,
        },
        totalSalesToday: {
          amount: +totalSalesToday || 0,
          items: totalItemsSoldToday || 0,
          achieved: +achievedTotalSalesToday.toFixed(2) || 0,
        },
        totalCustomers: {
          amount: +totalCustomers || 0,
          achieved: +achievedTotalCustomers.toFixed(2) || 0,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  // async getChart() {
  //   try {
  //     // Fetch product sales data from the database
  //     const products = await this.prisma.product.findMany({
  //       include: {
  //         OrderDetail: true,
  //       },
  //     });

  //     // Calculate total sales for each product
  //     const productSales = products.map((product) => {
  //       const totalSales = product.OrderDetail.reduce(
  //         (acc, orderDetail) => acc + orderDetail.totalPrice,
  //         0,
  //       );
  //       return {
  //         name: product.name,
  //         totalSales,
  //       };
  //     });

  //     // Calculate total sales for all products
  //     const totalSalesAllProducts = productSales.reduce(
  //       (acc, product) => acc + product.totalSales,
  //       0,
  //     );

  //     // Transform the data to the required format
  //     const barChartData = productSales.map((product, index) => ({
  //       id: index + 1,
  //       name: product.name,
  //       percentValues: (product.totalSales / totalSalesAllProducts) * 100,
  //     }));

  //     return barChartData;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async getChart() {
    try {
      // Fetching data from the database
      const orders = await this.prisma.order.findMany({
        include: {
          OrderDetail: {
            include: {
              product: true,
            },
          },
        },
      });

      // Grouping data by month
      const barChartData = orders.reduce((acc, order) => {
        const month = order.createdAt.toLocaleString('default', {
          month: 'short',
        });
        const income = order.totalPrice;

        const existingMonth = acc.find((data) => data.month === month);
        if (existingMonth) {
          existingMonth.income += income;
        } else {
          acc.push({ month, income });
        }
        return acc;
      }, []);

      // Aggregating data for progressData
      const productSales = orders.reduce((acc, order) => {
        order.OrderDetail.forEach((detail) => {
          const product = detail.product;
          if (product) {
            const existingProduct = acc.find(
              (data) => data.name === product.name,
            );
            if (existingProduct) {
              existingProduct.percentValues += detail.totalPrice;
            } else {
              acc.push({
                id: product.id,
                name: product.name,
                percentValues: detail.totalPrice,
              });
            }
          }
        });
        return acc;
      }, []);

      // Calculate total sales for percentage calculation
      const totalSales = productSales.reduce(
        (sum, product) => sum + product.percentValues,
        0,
      );
      const progressData = productSales.map((product) => ({
        ...product,
        percentValues: Math.round((product.percentValues / totalSales) * 100),
      }));

      return { barChartData, progressData };
    } catch (error) {
      throw error;
    }
  }

  async update(UpdateDashboardDto: UpdateDashboardDto) {
    try {
      await this.prisma.dashboard.update({
        where: { id: 1 },
        data: {
          achievedSales: +UpdateDashboardDto.achievedSales,
          achievedSalesToday: +UpdateDashboardDto.achievedSalesToday,
          achievedCustomers: +UpdateDashboardDto.achievedCustomers,
        },
      });
      return {
        message: 'Updated successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAchieved() {
    try {
      return await this.prisma.dashboard.findFirst();
    } catch (error) {
      throw error;
    }
  }
}
