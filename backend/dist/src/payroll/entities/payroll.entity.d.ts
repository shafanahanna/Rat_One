import { Employee } from '../../employee/employee.entity';
export declare class Payroll {
    id: string;
    employeeId: string;
    employee: Employee;
    month: number;
    year: number;
    basicSalary: number;
    allowances: number;
    deductions: number;
    unpaidDays: number;
    netSalary: number;
    paymentDate: Date;
    paymentStatus: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
