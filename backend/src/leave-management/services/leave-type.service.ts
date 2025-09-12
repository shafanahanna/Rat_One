import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateLeaveTypeDto } from '../dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from '../dto/update-leave-type.dto';
import { LeaveBalanceService } from './leave-balance.service';

@Injectable()
export class LeaveTypeService {
  private readonly logger = new Logger(LeaveTypeService.name);

  constructor(
    private readonly pgPool: Pool,
    private readonly leaveBalanceService: LeaveBalanceService
  ) {}

  async findAll() {
    try {
      const result = await this.pgPool.query(`
        SELECT 
          id, 
          name, 
          code,
          description,
          is_paid,
          is_active
        FROM leave_types
        ORDER BY name
      `);
      
      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      this.logger.error(`Error fetching leave types: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAllActive() {
    try {
      const result = await this.pgPool.query(`
        SELECT 
          id, 
          name, 
          code,
          description,
          is_paid,
          is_active
        FROM leave_types
        WHERE is_active = TRUE
        ORDER BY name
      `);
      
      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      this.logger.error(`Error fetching active leave types: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.pgPool.query(`
        SELECT 
          id, 
          name, 
          code,
          description,
          is_paid,
          is_active,
          created_at,
          updated_at
        FROM leave_types
        WHERE id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        throw new NotFoundException('Leave type not found');
      }
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      this.logger.error(`Error fetching leave type ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(createLeaveTypeDto: CreateLeaveTypeDto, userId: string) {
    const { name, code, description, is_paid, max_days, color } = createLeaveTypeDto;
    
    if (!name || !code) {
      throw new BadRequestException('Name and code are required');
    }
    
    try {
      // Ensure code is a string before calling toUpperCase
      const codeValue = typeof code === 'string' ? code.toUpperCase() : String(code).toUpperCase();
      
      // Insert with created_by and updated_by fields
      const result = await this.pgPool.query(`
        INSERT INTO leave_types (name, code, description, is_paid, max_days, color, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
        RETURNING id, name, code, description, is_paid, max_days, color, is_active, created_by, updated_by
      `, [name, codeValue, description, is_paid !== false, max_days, color, userId]);
      
      this.logger.log(`Leave type created successfully: ${JSON.stringify(result.rows[0])}`);
      
      // If the leave type is active, automatically create leave balances for all employees
      if (result.rows[0].is_active) {
        try {
          const currentYear = new Date().getFullYear();
          const populateResult = await this.leaveBalanceService.populateLeaveBalancesForType(
            result.rows[0].id, 
            currentYear
          );
          
          this.logger.log(`Leave balances populated for new leave type: ${JSON.stringify(populateResult)}`);
        } catch (balanceError) {
          // Log the error but don't fail the leave type creation
          this.logger.error(`Error populating leave balances: ${balanceError.message}`, balanceError.stack);
        }
      }
      
      return {
        success: true,
        message: 'Leave type created successfully',
        data: result.rows[0]
      };
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new BadRequestException('A leave type with this code already exists');
      }
      
      this.logger.error(`Error creating leave type: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateLeaveTypeDto: UpdateLeaveTypeDto, userId: string) {
    const { name, description, is_paid, is_active, max_days, color } = updateLeaveTypeDto;
    
    try {
      const result = await this.pgPool.query(`
        UPDATE leave_types
        SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          is_paid = COALESCE($3, is_paid),
          is_active = COALESCE($4, is_active),
          max_days = COALESCE($5, max_days),
          color = COALESCE($6, color),
          updated_by = $7,
          updated_at = NOW()
        WHERE id = $8
        RETURNING id, name, code, description, is_paid, max_days, color, is_active, created_by, updated_by
      `, [name, description, is_paid, is_active, max_days, color, userId, id]);
      
      if (result.rows.length === 0) {
        throw new NotFoundException('Leave type not found');
      }
      
      return {
        success: true,
        message: 'Leave type updated successfully',
        data: result.rows[0]
      };
    } catch (error) {
      this.logger.error(`Error updating leave type ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Check if leave type is used in any scheme
      const schemeCheck = await this.pgPool.query(`
        SELECT COUNT(*) FROM scheme_leave_types
        WHERE leave_type_id = $1
      `, [id]);
      
      if (parseInt(schemeCheck.rows[0].count) > 0) {
        throw new BadRequestException('Cannot delete leave type that is used in leave schemes');
      }
      
      // Delete the leave type
      const result = await this.pgPool.query(`
        DELETE FROM leave_types
        WHERE id = $1
        RETURNING id
      `, [id]);
      
      if (result.rows.length === 0) {
        throw new NotFoundException('Leave type not found');
      }
      
      return {
        success: true,
        message: 'Leave type deleted successfully'
      };
    } catch (error) {
      this.logger.error(`Error deleting leave type ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async softDelete(id: string) {
    try {
      // Update the leave type to inactive
      const result = await this.pgPool.query(`
        UPDATE leave_types
        SET 
          is_active = FALSE
        WHERE id = $1
        RETURNING id, name, code, description, is_paid, is_active
      `, [id]);
      
      if (result.rows.length === 0) {
        throw new NotFoundException('Leave type not found');
      }
      
      return {
        success: true,
        message: 'Leave type soft deleted successfully',
        data: result.rows[0]
      };
    } catch (error) {
      this.logger.error(`Error soft deleting leave type ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
