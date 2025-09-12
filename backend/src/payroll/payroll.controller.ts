import { Controller, Get, Post, Body, Param, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { RecalculatePayrollDto, PayrollPeriodDto, UpdatePayrollStatusDto } from './dto/payroll.dto';

@Controller('hr/payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('recalculate')
  @UsePipes(new ValidationPipe({ transform: true }))
  recalculatePayroll(@Body() recalculateDto: RecalculatePayrollDto) {
    return this.payrollService.recalculatePayroll(recalculateDto);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  runPayroll(@Body() periodDto: PayrollPeriodDto) {
    return this.payrollService.runPayroll(periodDto.month, periodDto.year);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getPayroll(@Query() periodDto: PayrollPeriodDto) {
    return this.payrollService.getPayroll(periodDto);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  updatePayrollStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdatePayrollStatusDto,
  ) {
    return this.payrollService.updatePayrollStatus(id, updateDto);
  }

  @Get('summary')
  @UsePipes(new ValidationPipe({ transform: true }))
  getPayrollSummary(@Query() periodDto: PayrollPeriodDto) {
    return this.payrollService.getPayrollSummary(periodDto);
  }
}
