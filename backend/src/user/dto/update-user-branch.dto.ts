import { IsOptional, IsUUID } from 'class-validator';

export class UpdateUserBranchDto {
  @IsOptional()
  @IsUUID()
  branch_id: string | null;
}
