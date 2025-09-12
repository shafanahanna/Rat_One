import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LeaveScheme } from '../entities/leave-scheme.entity';
import { SchemeLeaveType } from '../entities/scheme-leave-type.entity';
import { LeaveType } from '../entities/leave-type.entity';
import { CreateLeaveSchemeDto } from '../dto/create-leave-scheme.dto';
import { UpdateLeaveSchemeDto } from '../dto/update-leave-scheme.dto';
import { AddLeaveTypeToSchemeDto } from '../dto/add-leave-type-to-scheme.dto';
import { UpdateSchemeLeaveTypeDto } from '../dto/update-scheme-leave-type.dto';

@Injectable()
export class LeaveSchemeService {
  private readonly logger = new Logger(LeaveSchemeService.name);

  constructor(
    @InjectRepository(LeaveScheme)
    private leaveSchemeRepository: Repository<LeaveScheme>,
    @InjectRepository(SchemeLeaveType)
    private schemeLeaveTypeRepository: Repository<SchemeLeaveType>,
    @InjectRepository(LeaveType)
    private leaveTypeRepository: Repository<LeaveType>,
    private dataSource: DataSource
  ) {}

  async findAll() {
    try {
      const schemes = await this.leaveSchemeRepository
        .createQueryBuilder('ls')
        .leftJoin('users', 'u', 'ls.created_by = u.id')
        .select([
          'ls.id',
          'ls.name',
          'ls.is_active',
          'ls.created_at',
          'ls.updated_at',
          'u.email as created_by_name'
        ])
        .orderBy('ls.created_at', 'DESC')
        .getRawMany();
      
      return {
        success: true,
        data: schemes
      };
    } catch (error) {
      this.logger.error(`Error fetching leave schemes: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const scheme = await this.leaveSchemeRepository.findOne({ where: { id } });
      
      if (!scheme) {
        throw new NotFoundException(`Leave scheme with ID ${id} not found`);
      }
      
      return {
        success: true,
        data: scheme
      };
    } catch (error) {
      this.logger.error(`Error fetching leave scheme ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(createLeaveSchemeDto: CreateLeaveSchemeDto, userId: string) {
    const { name } = createLeaveSchemeDto;
    
    try {
      // Create the leave scheme
      const newScheme = this.leaveSchemeRepository.create({
        name,
        created_by: userId,
        updated_by: userId
      });
      
      const savedScheme = await this.leaveSchemeRepository.save(newScheme);
      
      return {
        success: true,
        message: 'Leave scheme created successfully',
        data: savedScheme
      };
    } catch (error) {
      this.logger.error(`Error creating leave scheme: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateLeaveSchemeDto: UpdateLeaveSchemeDto, userId: string) {
    const { name, is_active } = updateLeaveSchemeDto;
    
    try {
      const scheme = await this.leaveSchemeRepository.findOne({ where: { id } });
      
      if (!scheme) {
        throw new NotFoundException(`Leave scheme with ID ${id} not found`);
      }
      
      // Update the scheme
      if (name !== undefined) scheme.name = name;
      if (is_active !== undefined) scheme.is_active = is_active;
      scheme.updated_by = userId;
      
      const updatedScheme = await this.leaveSchemeRepository.save(scheme);
      
      return {
        success: true,
        message: 'Leave scheme updated successfully',
        data: updatedScheme
      };
    } catch (error) {
      this.logger.error(`Error updating leave scheme ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const scheme = await this.leaveSchemeRepository.findOne({ where: { id } });
      
      if (!scheme) {
        throw new NotFoundException(`Leave scheme with ID ${id} not found`);
      }
      
      await this.leaveSchemeRepository.remove(scheme);
      
      return {
        success: true,
        message: 'Leave scheme deleted successfully'
      };
    } catch (error) {
      this.logger.error(`Error deleting leave scheme ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getSchemeLeaveTypes(schemeId: string) {
    try {
      const scheme = await this.leaveSchemeRepository.findOne({ where: { id: schemeId } });
      
      if (!scheme) {
        throw new NotFoundException(`Leave scheme with ID ${schemeId} not found`);
      }
      
      const schemeLeaveTypes = await this.schemeLeaveTypeRepository
        .createQueryBuilder('slt')
        .leftJoin('leave_types', 'lt', 'slt.leave_type_id = lt.id')
        .select([
          'slt.id',
          'slt.scheme_id',
          'slt.leave_type_id',
          'slt.days_allowed',
          'slt.is_paid',
          'lt.name as leave_type_name',
          'lt.description as leave_type_description',
          'lt.color as leave_type_color'
        ])
        .where('slt.scheme_id = :schemeId', { schemeId })
        .getRawMany();
      
      return {
        success: true,
        data: schemeLeaveTypes
      };
    } catch (error) {
      this.logger.error(`Error fetching leave types for scheme ${schemeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async addLeaveTypeToScheme(schemeId: string, dto: AddLeaveTypeToSchemeDto, userId: string) {
    const { leave_type_id, days_allowed, is_paid } = dto;
    
    try {
      // Check if scheme exists
      const scheme = await this.leaveSchemeRepository.findOne({ where: { id: schemeId } });
      if (!scheme) {
        throw new NotFoundException(`Leave scheme with ID ${schemeId} not found`);
      }
      
      // Check if leave type exists
      const leaveType = await this.leaveTypeRepository.findOne({ where: { id: leave_type_id } });
      if (!leaveType) {
        throw new NotFoundException(`Leave type with ID ${leave_type_id} not found`);
      }
      
      // Check if this leave type is already added to the scheme
      const existingSchemeLeaveType = await this.schemeLeaveTypeRepository.findOne({
        where: {
          scheme_id: schemeId,
          leave_type_id: leave_type_id
        }
      });
      
      if (existingSchemeLeaveType) {
        throw new BadRequestException(`Leave type ${leave_type_id} is already added to scheme ${schemeId}`);
      }
      
      // Add leave type to scheme
      const schemeLeaveType = this.schemeLeaveTypeRepository.create({
        scheme_id: schemeId,
        leave_type_id,
        days_allowed,
        is_paid,
        created_by: userId,
        updated_by: userId
      });
      
      const savedSchemeLeaveType = await this.schemeLeaveTypeRepository.save(schemeLeaveType);
      
      // Get the leave type details to include in the response
      const result = {
        ...savedSchemeLeaveType,
        leave_type_name: leaveType.name,
        leave_type_description: leaveType.description,
        leave_type_color: leaveType.color
      };
      
      return {
        success: true,
        message: 'Leave type added to scheme successfully',
        data: result
      };
    } catch (error) {
      this.logger.error(`Error adding leave type to scheme: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateSchemeLeaveType(schemeId: string, id: string, dto: UpdateSchemeLeaveTypeDto, userId: string) {
    const { days_allowed, is_paid } = dto;
    
    try {
      const schemeLeaveType = await this.schemeLeaveTypeRepository.findOne({
        where: {
          id,
          scheme_id: schemeId
        }
      });
      
      if (!schemeLeaveType) {
        throw new NotFoundException(`Scheme leave type with ID ${id} not found in scheme ${schemeId}`);
      }
      
      // Update the scheme leave type
      if (days_allowed !== undefined) schemeLeaveType.days_allowed = days_allowed;
      if (is_paid !== undefined) schemeLeaveType.is_paid = is_paid;
      schemeLeaveType.updated_by = userId;
      
      const updatedSchemeLeaveType = await this.schemeLeaveTypeRepository.save(schemeLeaveType);
      
      // Get the leave type details to include in the response
      const leaveType = await this.leaveTypeRepository.findOne({
        where: { id: schemeLeaveType.leave_type_id }
      });
      
      const result = {
        ...updatedSchemeLeaveType,
        leave_type_name: leaveType.name,
        leave_type_description: leaveType.description,
        leave_type_color: leaveType.color
      };
      
      return {
        success: true,
        message: 'Scheme leave type updated successfully',
        data: result
      };
    } catch (error) {
      this.logger.error(`Error updating scheme leave type: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeLeaveTypeFromScheme(schemeId: string, id: string) {
    try {
      const schemeLeaveType = await this.schemeLeaveTypeRepository.findOne({
        where: {
          id,
          scheme_id: schemeId
        }
      });
      
      if (!schemeLeaveType) {
        throw new NotFoundException(`Scheme leave type with ID ${id} not found in scheme ${schemeId}`);
      }
      
      await this.schemeLeaveTypeRepository.remove(schemeLeaveType);
      
      return {
        success: true,
        message: 'Leave type removed from scheme successfully'
      };
    } catch (error) {
      this.logger.error(`Error removing leave type from scheme: ${error.message}`, error.stack);
      throw error;
    }
  }
}
