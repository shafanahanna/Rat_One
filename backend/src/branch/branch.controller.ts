import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';



@Controller('/branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return { data: this.branchService.create(createBranchDto) };
  }

  @Get()
  async findAll() {
    const branches = await this.branchService.getBranchesWithUserCount();
    return { data: branches };
  }

  @Get('country/:countryId')
  async findByCountry(@Param('countryId') countryId: string) {
    const branches = await this.branchService.getBranchesByCountry(countryId);
    return { data: branches };
  }

  @Get('code/:branchCode')
  async findByCode(@Param('branchCode') branchCode: string) {
    const branch = await this.branchService.getBranchByCode(branchCode);
    return { data: branch };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const branch = await this.branchService.findOne(id);
    return { data: branch };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    const updatedBranch = await this.branchService.update(id, updateBranchDto);
    return { data: updatedBranch };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.branchService.remove(id);
    return { message: 'Branch deleted successfully' };
  }
}
