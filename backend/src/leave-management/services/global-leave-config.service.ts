import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalLeaveConfig } from '../entities/global-leave-config.entity';
import { CreateGlobalLeaveConfigDto } from '../dto/create-global-leave-config.dto';
import { UpdateGlobalLeaveConfigDto } from '../dto/update-global-leave-config.dto';

@Injectable()
export class GlobalLeaveConfigService {
  constructor(
    @InjectRepository(GlobalLeaveConfig)
    private globalLeaveConfigRepository: Repository<GlobalLeaveConfig>,
  ) {}

  async create(createGlobalLeaveConfigDto: CreateGlobalLeaveConfigDto): Promise<GlobalLeaveConfig> {
    const config = this.globalLeaveConfigRepository.create(createGlobalLeaveConfigDto);
    return this.globalLeaveConfigRepository.save(config);
  }

  async findAll(): Promise<GlobalLeaveConfig[]> {
    return this.globalLeaveConfigRepository.find();
  }

  async findOne(id: string): Promise<GlobalLeaveConfig> {
    const config = await this.globalLeaveConfigRepository.findOne({ where: { id } });
    if (!config) {
      throw new NotFoundException(`Global leave configuration with ID ${id} not found`);
    }
    return config;
  }

  async findByKey(key: string): Promise<GlobalLeaveConfig> {
    const config = await this.globalLeaveConfigRepository.findOne({ where: { key } });
    if (!config) {
      throw new NotFoundException(`Global leave configuration with key ${key} not found`);
    }
    return config;
  }

  async findByYear(year: number): Promise<GlobalLeaveConfig> {
    const config = await this.globalLeaveConfigRepository.findOne({
      where: { key: `leave_config_${year}` },
    });

    if (config) {
      return config;
    }

    const defaultConfig = {
      key: `leave_config_${year}`,
      value: {
        year: year,
        allocations: [] // Will be populated with leave types and their max_days
      },
      description: `Leave configuration for year ${year}`,
    };

    const newConfig = this.globalLeaveConfigRepository.create(defaultConfig);
    return this.globalLeaveConfigRepository.save(newConfig);
  }

  async update(id: string, updateGlobalLeaveConfigDto: UpdateGlobalLeaveConfigDto): Promise<GlobalLeaveConfig> {
    const config = await this.findOne(id);
    this.globalLeaveConfigRepository.merge(config, updateGlobalLeaveConfigDto);
    return this.globalLeaveConfigRepository.save(config);
  }

  async updateByKey(key: string, updateGlobalLeaveConfigDto: UpdateGlobalLeaveConfigDto): Promise<GlobalLeaveConfig> {
    try {
      const config = await this.findByKey(key);
      
      // For leave config, replace the allocations array directly rather than merging
      if (key.startsWith('leave_config_') && 
          updateGlobalLeaveConfigDto.value && 
          typeof updateGlobalLeaveConfigDto.value === 'object' && 
          updateGlobalLeaveConfigDto.value.allocations) {
        
        // Keep the year but replace allocations
        // Ensure we're using max_days field in allocations
        const allocations = updateGlobalLeaveConfigDto.value.allocations.map(item => ({
          leave_type_id: item.leave_type_id,
          leave_type_name: item.leave_type_name,
          max_days: item.max_days,
          year: updateGlobalLeaveConfigDto.value.year
        }));
        
        updateGlobalLeaveConfigDto.value = {
          year: config.value.year || updateGlobalLeaveConfigDto.value.year,
          allocations: allocations
        };
      } 
      // For other configs, merge as before
      else if (updateGlobalLeaveConfigDto.value && typeof updateGlobalLeaveConfigDto.value === 'object') {
        updateGlobalLeaveConfigDto.value = {
          ...config.value,
          ...updateGlobalLeaveConfigDto.value,
        };
      }
      
      this.globalLeaveConfigRepository.merge(config, updateGlobalLeaveConfigDto);
      return this.globalLeaveConfigRepository.save(config);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // If config doesn't exist, create a new one
        return this.create({
          key,
          value: updateGlobalLeaveConfigDto.value,
          description: updateGlobalLeaveConfigDto.description,
        });
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const config = await this.findOne(id);
    await this.globalLeaveConfigRepository.remove(config);
  }
}
