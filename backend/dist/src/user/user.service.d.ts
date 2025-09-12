import { Repository, DataSource } from 'typeorm';
import { Branch } from '../branch/entities/branch.entity';
import { User } from '../auth/entities/user.entity';
export declare class UserService {
    private userRepository;
    private branchRepository;
    private dataSource;
    constructor(userRepository: Repository<User>, branchRepository: Repository<Branch>, dataSource: DataSource);
    findAllWithContext(): Promise<any>;
    findOneWithContext(id: string): Promise<any>;
    updateUserBranch(userId: string, branchId: string | null): Promise<any>;
    bulkUpdateUserBranch(userIds: string[], branchId: string | null): Promise<{
        updated_count: any;
        users: any;
    }>;
    findByBranch(branchId: string): Promise<any>;
    findByCountry(countryId: string): Promise<any>;
    findUnassigned(): Promise<any>;
    getAssignmentStats(): Promise<{
        assignments: any;
        unassigned_count: number;
    }>;
}
