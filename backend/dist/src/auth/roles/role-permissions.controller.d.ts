import { RolesService } from './roles.service';
export declare class RolePermissionsController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    getAllRolePermissions(): Promise<{
        success: boolean;
        data: {};
    }>;
    getRolePermissions(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            permissions: string[];
        };
    }>;
    updateRolePermissions(id: string, body: {
        permissionIds: string[];
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            permissions: string[];
        };
    }>;
}
