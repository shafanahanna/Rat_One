import { SetMetadata } from '@nestjs/common';

export const DesignationPermissions = (...permissions: (string | string[])[]) => 
  SetMetadata('designation-permissions', permissions);
