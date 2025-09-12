import { CreateBranchDto } from './create-branch.dto';
declare const UpdateBranchDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBranchDto>>;
export declare class UpdateBranchDto extends UpdateBranchDto_base {
    country_id?: string;
    branch_code?: string;
    branch_name?: string;
    city?: string;
    state_province?: string;
    is_headquarters?: boolean;
    manager_user_id?: string;
}
export {};
