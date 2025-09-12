import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from '../entities/leave-type.entity';
import { GlobalLeaveConfig } from '../entities/global-leave-config.entity';

@Injectable()
export class LeaveTypeSetupService {
  constructor(
    @InjectRepository(LeaveType)
    private leaveTypeRepository: Repository<LeaveType>,
    @InjectRepository(GlobalLeaveConfig)
    private globalLeaveConfigRepository: Repository<GlobalLeaveConfig>,
  ) {}

  async setupDefaultLeaveTypes() {
    // Define default leave types
    const defaultLeaveTypes = [
      {
        name: 'Casual Leave',
        max_days: 6,
        description: 'Leave for personal matters',
        color: '#4CAF50', // Green
        is_paid: true,
        is_active: true,
      },
      {
        name: 'Sick Leave',
        max_days: 6,
        description: 'Leave for health issues',
        color: '#F44336', // Red
        is_paid: true,
        is_active: true,
      },
      {
        name: 'Unpaid Leave',
        max_days: 30,
        description: 'Leave without pay',
        color: '#9E9E9E', // Gray
        is_paid: false,
        is_active: true,
      },
    ];

    const createdLeaveTypes = [];

    // Create leave types if they don't exist
    for (const leaveTypeData of defaultLeaveTypes) {
      const existingLeaveType = await this.leaveTypeRepository.findOne({
        where: { name: leaveTypeData.name },
      });

      if (!existingLeaveType) {
        const newLeaveType = this.leaveTypeRepository.create(leaveTypeData);
        const savedLeaveType = await this.leaveTypeRepository.save(newLeaveType);
        createdLeaveTypes.push(savedLeaveType);
      } else {
        createdLeaveTypes.push(existingLeaveType);
      }
    }

    // Set up global leave configuration for current year
    const currentYear = new Date().getFullYear();
    await this.setupGlobalLeaveConfig(currentYear, createdLeaveTypes);

    return {
      message: 'Default leave types and configuration set up successfully',
      leaveTypes: createdLeaveTypes,
    };
  }

  private async setupGlobalLeaveConfig(year: number, leaveTypes: LeaveType[]) {
    const configKey = `leave_config_${year}`;
    
    // Check if config already exists
    const existingConfig = await this.globalLeaveConfigRepository.findOne({
      where: { key: configKey },
    });

    // Create allocations based on leave types
    const allocations = leaveTypes.map(leaveType => ({
      leave_type_id: leaveType.id,
      leave_type_name: leaveType.name,
      max_days: leaveType.max_days,
    }));

    const configValue = {
      year,
      allocations,
    };

    if (existingConfig) {
      // Update existing config
      existingConfig.value = configValue;
      await this.globalLeaveConfigRepository.save(existingConfig);
      return existingConfig;
    } else {
      // Create new config
      const newConfig = this.globalLeaveConfigRepository.create({
        key: configKey,
        value: configValue,
        description: `Leave configuration for year ${year}`,
      });
      return this.globalLeaveConfigRepository.save(newConfig);
    }
  }
}
