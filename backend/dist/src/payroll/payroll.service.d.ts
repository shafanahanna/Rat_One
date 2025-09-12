import { Repository, DataSource } from 'typeorm';
import { Payroll } from './entities/payroll.entity';
import { Employee } from '../employee/employee.entity';
import { RecalculatePayrollDto, PayrollPeriodDto, UpdatePayrollStatusDto } from './dto/payroll.dto';
export declare class PayrollService {
    private payrollRepository;
    private employeeRepository;
    private dataSource;
    constructor(payrollRepository: Repository<Payroll>, employeeRepository: Repository<Employee>, dataSource: DataSource);
    recalculatePayroll(recalculateDto: RecalculatePayrollDto): Promise<{
        message: string;
    }>;
    runPayroll(month: number, year: number, manager?: any): Promise<{
        count: number;
    }>;
    getPayroll(periodDto: PayrollPeriodDto): Promise<Payroll[]>;
    updatePayrollStatus(id: string, updateDto: UpdatePayrollStatusDto): Promise<{
        message: string;
    }>;
    getPayrollSummary(periodDto: PayrollPeriodDto): Promise<any>;
}
