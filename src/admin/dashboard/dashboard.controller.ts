import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  findAll() {
    return this.dashboardService.findAll();
  }

  @Get('chart')
  @UseGuards(AuthenticationGuard)
  getChart() {
    return this.dashboardService.getChart();
  }

  @Patch()
  @UseGuards(AuthenticationGuard)
  update(@Body() updateDashboardDto: UpdateDashboardDto) {
    return this.dashboardService.update(updateDashboardDto);
  }

  @Get('achieve')
  @UseGuards(AuthenticationGuard)
  getAchieved() {
    return this.dashboardService.getAchieved();
  }
}
