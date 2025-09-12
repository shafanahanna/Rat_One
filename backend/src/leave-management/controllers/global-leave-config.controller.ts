import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GlobalLeaveConfigService } from '../services/global-leave-config.service';
import { CreateGlobalLeaveConfigDto } from '../dto/create-global-leave-config.dto';
import { UpdateGlobalLeaveConfigDto } from '../dto/update-global-leave-config.dto';

@Controller('leave-management/global-config')
export class GlobalLeaveConfigController {
  constructor(private readonly globalLeaveConfigService: GlobalLeaveConfigService) {}

  @Post()
  async create(@Body() createGlobalLeaveConfigDto: CreateGlobalLeaveConfigDto) {
    return this.globalLeaveConfigService.create(createGlobalLeaveConfigDto);
  }

  @Get()
  async findAll(@Query('year') year?: string) {
    if (year) {
      return this.globalLeaveConfigService.findByYear(parseInt(year));
    }
    return this.globalLeaveConfigService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.globalLeaveConfigService.findOne(id);
  }

  @Get('key/:key')
  async findByKey(@Param('key') key: string) {
    return this.globalLeaveConfigService.findByKey(key);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGlobalLeaveConfigDto: UpdateGlobalLeaveConfigDto) {
    return this.globalLeaveConfigService.update(id, updateGlobalLeaveConfigDto);
  }

  @Post(':key')
  async updateByKey(@Param('key') key: string, @Body() updateGlobalLeaveConfigDto: UpdateGlobalLeaveConfigDto) {
    return this.globalLeaveConfigService.updateByKey(key, updateGlobalLeaveConfigDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.globalLeaveConfigService.remove(id);
  }
}
