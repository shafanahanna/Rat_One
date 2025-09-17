import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/role.entity").CustomRole;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: import("./entities/role.entity").CustomRole[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./entities/role.entity").CustomRole;
    }>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/role.entity").CustomRole;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
