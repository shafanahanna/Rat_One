import { Controller, Get, Param, Put, Body, UseGuards, Query, Post } from '@nestjs/common';
import { UpdateUserBranchDto } from './dto/update-user-branch.dto';
import { UserWithContextDto } from './dto/user-with-context.dto';
import { AssignmentStatsDto } from './dto/assignment-stats.dto';
import { BulkUpdateResultDto } from './dto/bulk-update-result.dto';
import { BulkUpdateUserBranchDto } from './dto/bulk-update-user-branch.dto';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('with-context')
  async getUsersWithContext(): Promise<{ data: UserWithContextDto[] }> {
    const users = await this.userService.findAllWithContext();
    return { data: users };
  }

  @Get(':id/context')
  async getUserWithContext(@Param('id') id: string): Promise<{ data: UserWithContextDto }> {
    const user = await this.userService.findOneWithContext(id);
    return { data: user };
  }

  @Put(':id/branch')
  async updateUserBranch(
    @Param('id') id: string,
    @Body() updateUserBranchDto: UpdateUserBranchDto,
  ): Promise<{ data: UserWithContextDto }> {
    const updatedUser = await this.userService.updateUserBranch(id, updateUserBranchDto.branch_id);
    return { data: updatedUser };
  }

  @Put('bulk-branch-update')
  async bulkUpdateUserBranch(@Body() bulkUpdateDto: BulkUpdateUserBranchDto): Promise<{ message: string, data: BulkUpdateResultDto }> {
    const result = await this.userService.bulkUpdateUserBranch(
      bulkUpdateDto.user_ids,
      bulkUpdateDto.branch_id,
    );
    return { 
      message: `${result.updated_count} users updated successfully`,
      data: result 
    };
  }

  @Get('branch/:branch_id')
  async getUsersByBranch(@Param('branch_id') branchId: string): Promise<{ data: UserWithContextDto[] }> {
    const users = await this.userService.findByBranch(branchId);
    return { data: users };
  }

  @Get('country/:country_id')
  async getUsersByCountry(@Param('country_id') countryId: string): Promise<{ data: UserWithContextDto[] }> {
    const users = await this.userService.findByCountry(countryId);
    return { data: users };
  }

  @Get('unassigned')
  async getUnassignedUsers(): Promise<{ data: UserWithContextDto[] }> {
    const users = await this.userService.findUnassigned();
    return { data: users };
  }

  @Get('assignment-stats')
  async getAssignmentStats(): Promise<{ data: AssignmentStatsDto }> {
    const stats = await this.userService.getAssignmentStats();
    return { data: stats };
  }
}
