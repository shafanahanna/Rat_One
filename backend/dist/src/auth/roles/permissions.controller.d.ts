import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    getAvailablePermissions(): Promise<{
        success: boolean;
        data: any[];
    }>;
    getPermissionsByModule(): Promise<{
        success: boolean;
        data: {};
    }>;
}
