import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceDto } from './dto/attendance.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async getAttendance(month: string, year: string): Promise<Attendance[]> {
    try {
      // Convert month and year to integers
      const monthInt = parseInt(month, 10);
      const yearInt = parseInt(year, 10);

      // Validate month and year
      if (isNaN(monthInt) || isNaN(yearInt) || monthInt < 1 || monthInt > 12 || yearInt < 1900) {
        throw new BadRequestException('Invalid month or year');
      }

      // Use TypeORM query builder to extract month and year from date
      const query = this.attendanceRepository
        .createQueryBuilder('attendance')
        .where('EXTRACT(MONTH FROM attendance.date) = :month', { month: monthInt })
        .andWhere('EXTRACT(YEAR FROM attendance.date) = :year', { year: yearInt });

      return await query.getMany();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error fetching attendance:', error);
      throw new InternalServerErrorException('Failed to fetch attendance records');
    }
  }

  async setAttendance(attendanceDto: AttendanceDto): Promise<Attendance | null> {
    const { employee_id, date, status } = attendanceDto;

    try {
      // If status is empty, delete the record
      if (status === '') {
        await this.attendanceRepository.delete({ employee_id, date });
        return null;
      }

      // Check if record exists
      const existingRecord = await this.attendanceRepository.findOne({
        where: { employee_id, date },
      });

      if (existingRecord) {
        // Update existing record
        existingRecord.status = status;
        return await this.attendanceRepository.save(existingRecord);
      } else {
        // Create new record
        const newAttendance = this.attendanceRepository.create({
          employee_id,
          date,
          status,
        });
        return await this.attendanceRepository.save(newAttendance);
      }
    } catch (error) {
      console.error(`Error setting attendance for employee ${employee_id} on ${date}:`, error);
      throw new InternalServerErrorException('Failed to set attendance');
    }
  }

  async getDailyAttendanceSummary(date: string): Promise<any> {
    try {
      // Get attendance counts by status for the given date
      const summaryQuery = this.attendanceRepository
        .createQueryBuilder('attendance')
        .select('attendance.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('attendance.date = :date', { date })
        .groupBy('attendance.status');

      const summaryRows = await summaryQuery.getRawMany();

      // Get total number of employees
      const totalEmployees = await this.employeeRepository.count();

      // Initialize summary object
      const summary = {
        present: 0,
        absent: 0,
        leave: 0,
        halfday: 0,
        holiday: 0,
        sick: 0,
        total_employees: totalEmployees,
        not_marked: totalEmployees,
      };

      // Fill in the counts from the query results
      let markedEmployees = 0;
      summaryRows.forEach(row => {
        const status = row.status.toLowerCase();
        const count = parseInt(row.count, 10);
        
        if (status === 'present') summary.present = count;
        if (status === 'absent') summary.absent = count;
        if (status === 'leave') summary.leave = count;
        if (status === 'halfday') summary.halfday = count;
        if (status === 'holiday') summary.holiday = count;
        if (status === 'sick') summary.sick = count;
        
        markedEmployees += count;
      });

      // Calculate not marked employees
      summary.not_marked = totalEmployees - markedEmployees;

      return summary;
    } catch (error) {
      console.error('Error fetching daily attendance summary:', error);
      throw new InternalServerErrorException('Failed to fetch daily attendance summary');
    }
  }
}
