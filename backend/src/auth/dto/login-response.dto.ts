export class LoginResponseDto {
  status: string;
  message: string;
  token?: string;
  role?: string;
  id?: string;
  idType?: 'uuid' | 'integer';
  country?: string;
  branch?: string;
  context?: {
    country_id: string | null;
    branch_id: string | null;
    is_global: boolean;
  };
}
