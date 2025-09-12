import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    // Ensure employee_id is available as an alias for employeeId for backward compatibility
    if (user && user.employeeId && !user.employee_id) {
      user.employee_id = user.employeeId;
    }
    
    return data ? user?.[data] : user;
  },
);
