import { UserRole } from '../../auth/dto/register.dto';

export class UserWithContextDto {
  // User properties
  id: string;
  username: string;
  email: string;
  role: UserRole;
  employee_id: string | null;
  branch_id: string | null;
  created_at: Date;
  updated_at: Date;
  
  // Branch properties
  branch_code?: string;
  branch_name?: string;
  city?: string;
  state_province?: string;
  country_id?: string;
  
  // Country properties
  country_code?: string;
  country_name?: string;
  transaction_currency?: string;
  currency_symbol?: string;
  timezone?: string;
}
