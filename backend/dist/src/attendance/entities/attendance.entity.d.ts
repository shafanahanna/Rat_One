import { Employee } from './employee.entity';
export declare class Attendance {
    id: string;
    employee_id: string;
    date: Date;
    status: string;
    createdAt: Date;
    employee: Employee;
}
