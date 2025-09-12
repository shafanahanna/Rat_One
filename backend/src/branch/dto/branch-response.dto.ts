import { Exclude, Expose, Type } from 'class-transformer';

export class CountryInfoDto {
  country_name: string;
  country_code: string;
  transaction_currency: string;
  currency_symbol: string;
}

export class BranchResponseDto {
  id: string;
  country_id: string;
  branch_code: string;
  branch_name: string;
  city: string;
  state_province: string;
  is_headquarters: boolean;
  manager_user_id: string;
  created_at: Date;
  updated_at: Date;
  
  @Type(() => CountryInfoDto)
  country: CountryInfoDto;
  
  user_count: number;
}

export class BranchListResponseDto {
  @Expose()
  @Type(() => BranchResponseDto)
  data: BranchResponseDto[];
}

export class SingleBranchResponseDto {
  @Expose()
  @Type(() => BranchResponseDto)
  data: BranchResponseDto;
}
