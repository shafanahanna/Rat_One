import { PayrollService } from './payroll.service';
import { RecalculatePayrollDto, PayrollPeriodDto, UpdatePayrollStatusDto } from './dto/payroll.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    recalculatePayroll(recalculateDto: RecalculatePayrollDto): Promise<{
        message: string;
    }>;
    runPayroll(periodDto: PayrollPeriodDto): Promise<{
        count: number;
    }>;
    getPayroll(periodDto: PayrollPeriodDto): Promise<import("./entities/payroll.entity").Payroll[]>;
    updatePayrollStatus(id: string, updateDto: UpdatePayrollStatusDto): Promise<{
        message: string;
    }>;
    getPayrollSummary(periodDto: PayrollPeriodDto): Promise<any>;
}
