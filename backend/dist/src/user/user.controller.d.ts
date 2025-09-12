import { UpdateUserBranchDto } from './dto/update-user-branch.dto';
import { UserWithContextDto } from './dto/user-with-context.dto';
import { AssignmentStatsDto } from './dto/assignment-stats.dto';
import { BulkUpdateResultDto } from './dto/bulk-update-result.dto';
import { BulkUpdateUserBranchDto } from './dto/bulk-update-user-branch.dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUsersWithContext(): Promise<{
        data: UserWithContextDto[];
    }>;
    getUserWithContext(id: string): Promise<{
        data: UserWithContextDto;
    }>;
    updateUserBranch(id: string, updateUserBranchDto: UpdateUserBranchDto): Promise<{
        data: UserWithContextDto;
    }>;
    bulkUpdateUserBranch(bulkUpdateDto: BulkUpdateUserBranchDto): Promise<{
        message: string;
        data: BulkUpdateResultDto;
    }>;
    getUsersByBranch(branchId: string): Promise<{
        data: UserWithContextDto[];
    }>;
    getUsersByCountry(countryId: string): Promise<{
        data: UserWithContextDto[];
    }>;
    getUnassignedUsers(): Promise<{
        data: UserWithContextDto[];
    }>;
    getAssignmentStats(): Promise<{
        data: AssignmentStatsDto;
    }>;
}
