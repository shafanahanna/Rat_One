import { Controller, Get, Post, Body, Query, ValidationPipe, UsePipes, HttpStatus, HttpException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceDto, GetAttendanceQueryDto, GetDailyAttendanceSummaryDto } from './dto/attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAttendance(@Query() query: GetAttendanceQueryDto) {
    const { month, year } = query;
    
    if (!month || !year) {
      throw new HttpException({
        status: 'Error',
        message: 'Month and year are required.',
      }, HttpStatus.BAD_REQUEST);
    }

    try {
      const data = await this.attendanceService.getAttendance(month.toString(), year.toString());
      return {
        status: 'Success',
        data,
      };
    } catch (error) {
      throw new HttpException({
        status: 'Error',
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async setAttendance(@Body() attendanceDto: AttendanceDto) {
    try {
      const result = await this.attendanceService.setAttendance(attendanceDto);
      
      if (result === null) {
        return {
          status: 'Success',
          message: 'Attendance unmarked.',
          data: null,
        };
      }
      
      return {
        status: 'Success',
        data: result,
      };
    } catch (error) {
      throw new HttpException({
        status: 'Error',
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('summary')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getDailyAttendanceSummary(@Query() query: GetDailyAttendanceSummaryDto) {
    const { date } = query;
    
    if (!date) {
      throw new HttpException({
        message: 'Date is required.',
      }, HttpStatus.BAD_REQUEST);
    }

    try {
      // Format date as YYYY-MM-DD string
      const dateString = date.toISOString().split('T')[0];
      const summary = await this.attendanceService.getDailyAttendanceSummary(dateString);
      return summary;
    } catch (error) {
      throw new HttpException({
        message: 'Failed to fetch daily attendance summary.',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
