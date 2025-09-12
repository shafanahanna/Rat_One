import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class BulkUpdateUserBranchDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  user_ids: string[];

  @IsOptional()
  @IsUUID()
  branch_id: string | null;
}
