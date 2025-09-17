export declare class PermissionsService {
    getAllPermissions(): any[];
    getPermissionsByModule(): {};
    hasPermission(userRole: string, requiredPermission: string, rolesService: any): Promise<boolean>;
}
