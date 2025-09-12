export class BranchAssignmentDto {
  branch_name: string;
  branch_code: string;
  user_count: number;
}

export class CountryAssignmentDto {
  country_name: string;
  transaction_currency: string;
  branch_name: string;
  branch_code: string;
  user_count: number;
}

export class AssignmentStatsDto {
  assignments: CountryAssignmentDto[];
  unassigned_count: number;
}
