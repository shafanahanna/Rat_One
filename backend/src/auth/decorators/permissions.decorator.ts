import { SetMetadata } from '@nestjs/common';

/**
 * Decorator for specifying required permissions for a route
 * @param permissions An array of permission strings or arrays of strings
 * 
 * Usage:
 * - @Permissions('permission1') - Requires 'permission1'
 * - @Permissions(['permission1', 'permission2']) - Requires 'permission1' OR 'permission2'
 * - @Permissions('permission1', 'permission2') - Requires 'permission1' AND 'permission2'
 * - @Permissions(['permission1', 'permission2'], 'permission3') - Requires ('permission1' OR 'permission2') AND 'permission3'
 */
export const Permissions = (...permissions: (string | string[])[]) => SetMetadata('permissions', permissions);
