import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
export declare class BranchController {
    private readonly branchService;
    constructor(branchService: BranchService);
    create(createBranchDto: CreateBranchDto): {
        data: Promise<import("./entities/branch.entity").Branch>;
    };
    findAll(): Promise<{
        data: any[];
    }>;
    findByCountry(countryId: string): Promise<{
        data: import("./entities/branch.entity").Branch[];
    }>;
    findByCode(branchCode: string): Promise<{
        data: import("./entities/branch.entity").Branch;
    }>;
    findOne(id: string): Promise<{
        data: import("./entities/branch.entity").Branch;
    }>;
    update(id: string, updateBranchDto: UpdateBranchDto): Promise<{
        data: import("./entities/branch.entity").Branch;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
