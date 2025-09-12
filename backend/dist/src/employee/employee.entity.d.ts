import { Branch } from '../branch/entities/branch.entity';
import { User } from 'src/auth/entities/user.entity';
export declare class Employee {
    id: string;
    userId: string;
    user: User;
    fullName: string;
    department: string;
    designation: string;
    dateOfJoining: Date;
    salary: number;
    proposedSalary: number;
    salaryStatus: string;
    empCode: string;
    branchId: string;
    branch: Branch;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
}
