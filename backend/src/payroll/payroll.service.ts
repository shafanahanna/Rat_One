import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payroll } from './entities/payroll.entity';
import { Employee } from '../employee/employee.entity';
import { RecalculatePayrollDto, PayrollPeriodDto, UpdatePayrollStatusDto } from './dto/payroll.dto';
import { format, getDaysInMonth, parseISO } from 'date-fns';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private dataSource: DataSource,
  ) {}

  async recalculatePayroll(recalculateDto: RecalculatePayrollDto): Promise<{ message: string }> {
    const { month, year, forceRecalculate } = recalculateDto;
    
    // Check if payroll records exist for the given month and year
    const existingRecords = await this.payrollRepository.count({
      where: { month, year }
    });

    if (existingRecords > 0 && !forceRecalculate) {
      return {
        message: `Payroll records already exist for ${month}/${year}. Set forceRecalculate to true to delete and recalculate.`
      };
    }

    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete existing records if any
      if (existingRecords > 0) {
        await queryRunner.manager.delete(Payroll, { month, year });
      }

      // Run payroll calculation
      const result = await this.runPayroll(month, year, queryRunner.manager);
      
      // Commit the transaction
      await queryRunner.commitTransaction();
      
      return {
        message: `Payroll recalculated successfully for ${month}/${year}. ${result.count} records created.`
      };
    } catch (error) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed to recalculate payroll: ${error.message}`);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async runPayroll(month: number, year: number, manager?: any): Promise<{ count: number }> {
    // Use provided manager or default repository
    const repo = manager ? manager.getRepository(Payroll) : this.payrollRepository;
    const employeeRepo = manager ? manager.getRepository(Employee) : this.employeeRepository;
    
    // Get all active employees
    const employees = await employeeRepo.find();
    
    // Get days in month
    const daysInMonth = getDaysInMonth(new Date(year, month - 1));
    
    let count = 0;
    
    // Process each employee
    for (const employee of employees) {
      // Skip if employee joined after this month
      const joinDate = parseISO(employee.dateOfJoining);
      if (joinDate > new Date(year, month - 1, daysInMonth)) {
        continue;
      }
      
      // Calculate working days based on join date
      let workingDays = daysInMonth;
      if (joinDate.getFullYear() === year && joinDate.getMonth() === month - 1) {
        workingDays = daysInMonth - joinDate.getDate() + 1;
      }
      
      // Get attendance data (absent and half days)
      const attendanceQuery = `
        SELECT 
          COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent_days,
          COUNT(CASE WHEN status = 'Half Day' THEN 1 END) as half_days
        FROM attendance
        WHERE employee_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3
      `;
      
      const attendanceResult = await this.dataSource.query(attendanceQuery, [
        employee.id,
        month,
        year
      ]);
      
      const absentDays = attendanceResult[0]?.absent_days || 0;
      const halfDays = attendanceResult[0]?.half_days || 0;
      
      // Calculate unpaid days
      const unpaidDays = absentDays + (halfDays / 2);
      
      // Calculate salary deductions
      const dailyRate = employee.salary / daysInMonth;
      const deductions = unpaidDays * dailyRate;
      
      // Calculate net salary
      const netSalary = employee.salary - deductions;
      
      // Create payroll record
      const payroll = repo.create({
        employeeId: employee.id,
        month,
        year,
        basicSalary: employee.salary,
        allowances: 0, // Default allowances to 0
        unpaidDays,
        deductions,
        netSalary,
        paymentStatus: 'Pending',
        notes: `Auto-generated payroll for ${month}/${year}`
      });
      
      await repo.save(payroll);
      count++;
    }
    
    return { count };
  }

  async getPayroll(periodDto: PayrollPeriodDto): Promise<Payroll[]> {
    const { month, year } = periodDto;
    
    const payrollQuery = `
      SELECT 
        p.*,
        e.full_name as employee_name,
        e.emp_code as employee_code,
        e.designation
      FROM payroll p
      JOIN employee e ON p.employee_id = e.id
      WHERE p.month = $1 AND p.year = $2
      ORDER BY e.full_name
    `;
    
    const payrollData = await this.dataSource.query(payrollQuery, [month, year]);
    
    if (!payrollData || payrollData.length === 0) {
      return [];
    }
    
    return payrollData;
  }

  async updatePayrollStatus(id: string, updateDto: UpdatePayrollStatusDto): Promise<{ message: string }> {
    const { payment_status, payment_date } = updateDto;
    
    // Only allow updating to "Paid" status
    if (payment_status !== 'Paid') {
      throw new BadRequestException('Only "Paid" status is allowed');
    }
    
    const payroll = await this.payrollRepository.findOne({ where: { id } });
    
    if (!payroll) {
      throw new NotFoundException(`Payroll record with ID ${id} not found`);
    }
    
    payroll.paymentStatus = payment_status;
    
    // Set payment date to today if not provided
    if (payment_date) {
      payroll.paymentDate = payment_date;
    } else {
      payroll.paymentDate = new Date();
    }
    
    await this.payrollRepository.save(payroll);
    
    return { message: `Payroll status updated to ${payment_status}` };
  }

  async getPayrollSummary(periodDto: PayrollPeriodDto): Promise<any> {
    const { month, year } = periodDto;
    
    const summaryQuery = `
      SELECT 
        COUNT(*) as employee_count,
        SUM(basic_salary) as total_gross,
        SUM(deductions) as total_deductions,
        SUM(net_salary) as total_net
      FROM payroll
      WHERE month = $1 AND year = $2
    `;
    
    const summary = await this.dataSource.query(summaryQuery, [month, year]);
    
    if (!summary || summary.length === 0) {
      return {
        employee_count: 0,
        total_gross: 0,
        total_deductions: 0,
        total_net: 0
      };
    }
    
    return summary[0];
  }
}
