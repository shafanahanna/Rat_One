import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { AssignSchemeToEmployeeDto } from '../dto/assign-scheme-to-employee.dto';

@Injectable()
export class EmployeeLeaveSchemeService {
  private readonly logger = new Logger(EmployeeLeaveSchemeService.name);

  constructor(private readonly pgPool: Pool) {}

  async findByEmployeeId(employeeId: string) {
    try {
      const result = await this.pgPool.query(`
        SELECT 
          els.id,
          ls.id as scheme_id,
          ls.name as scheme_name,
          els.effective_from,
          els.effective_to,
          els.created_at
        FROM employee_leave_schemes els
        JOIN leave_schemes ls ON els.scheme_id = ls.id
        WHERE els.employee_id = $1
        ORDER BY els.created_at DESC
      `, [employeeId]);

      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      this.logger.error(`Error fetching employee leave schemes for employee ${employeeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.pgPool.query(`
        SELECT 
          els.id,
          els.employee_id,
          els.scheme_id,
          ls.name as scheme_name,
          els.effective_from,
          els.effective_to,
          els.created_at,
          els.updated_at
        FROM employee_leave_schemes els
        JOIN leave_schemes ls ON els.scheme_id = ls.id
        WHERE els.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        throw new NotFoundException('Employee leave scheme assignment not found');
      }

      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      this.logger.error(`Error fetching employee leave scheme assignment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(dto: AssignSchemeToEmployeeDto, userId: string) {
    const { employee_id, scheme_id, effective_from, effective_to } = dto;

    try {
      // Check for overlapping assignments
      const overlapCheck = await this.pgPool.query(`
        SELECT id FROM employee_leave_schemes
        WHERE employee_id = $1
        AND (
          (effective_from <= $2 AND (effective_to IS NULL OR effective_to >= $2))
          OR (effective_from <= $3 AND (effective_to IS NULL OR effective_to >= $3))
          OR ($2 <= effective_from AND $3 >= effective_from)
        )
      `, [employee_id, effective_from, effective_to || '9999-12-31']);

      if (overlapCheck.rows.length > 0) {
        throw new BadRequestException('This assignment overlaps with an existing leave scheme assignment');
      }

      const result = await this.pgPool.query(`
        INSERT INTO employee_leave_schemes (employee_id, scheme_id, effective_from, effective_to, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $5)
        RETURNING id, employee_id, scheme_id, effective_from, effective_to
      `, [employee_id, scheme_id, effective_from, effective_to, userId]);

      return {
        success: true,
        message: 'Leave scheme assigned to employee successfully',
        data: result.rows[0]
      };
    } catch (error) {
      this.logger.error(`Error assigning leave scheme to employee: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: Partial<AssignSchemeToEmployeeDto>, userId: string) {
    const { effective_from, effective_to } = dto;

    try {
      // Get current assignment
      const currentAssignment = await this.pgPool.query(`
        SELECT employee_id, scheme_id FROM employee_leave_schemes
        WHERE id = $1
      `, [id]);

      if (currentAssignment.rows.length === 0) {
        throw new NotFoundException('Employee leave scheme assignment not found');
      }

      const employeeId = currentAssignment.rows[0].employee_id;

      // Check for overlapping assignments (excluding this one)
      if (effective_from || effective_to) {
        const newEffectiveFrom = effective_from || (await this.findOne(id)).data.effective_from;
        const newEffectiveTo = effective_to || (await this.findOne(id)).data.effective_to || '9999-12-31';

        const overlapCheck = await this.pgPool.query(`
          SELECT id FROM employee_leave_schemes
          WHERE employee_id = $1
          AND id != $2
          AND (
            (effective_from <= $3 AND (effective_to IS NULL OR effective_to >= $3))
            OR (effective_from <= $4 AND (effective_to IS NULL OR effective_to >= $4))
            OR ($3 <= effective_from AND $4 >= effective_from)
          )
        `, [employeeId, id, newEffectiveFrom, newEffectiveTo]);

        if (overlapCheck.rows.length > 0) {
          throw new BadRequestException('This assignment would overlap with an existing leave scheme assignment');
        }
      }

      const result = await this.pgPool.query(`
        UPDATE employee_leave_schemes
        SET 
          effective_from = COALESCE($1, effective_from),
          effective_to = $2,
          updated_by = $3,
          updated_at = NOW()
        WHERE id = $4
        RETURNING id, employee_id, scheme_id, effective_from, effective_to
      `, [effective_from, effective_to, userId, id]);

      return {
        success: true,
        message: 'Employee leave scheme assignment updated successfully',
        data: result.rows[0]
      };
    } catch (error) {
      this.logger.error(`Error updating employee leave scheme assignment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const result = await this.pgPool.query(`
        DELETE FROM employee_leave_schemes
        WHERE id = $1
        RETURNING id
      `, [id]);

      if (result.rows.length === 0) {
        throw new NotFoundException('Employee leave scheme assignment not found');
      }

      return {
        success: true,
        message: 'Employee leave scheme assignment removed successfully'
      };
    } catch (error) {
      this.logger.error(`Error removing employee leave scheme assignment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getCurrentSchemeForEmployee(employeeId: string, date: string = new Date().toISOString().split('T')[0]) {
    try {
      const result = await this.pgPool.query(`
        SELECT 
          els.id,
          els.scheme_id,
          ls.name as scheme_name,
          els.effective_from,
          els.effective_to
        FROM employee_leave_schemes els
        JOIN leave_schemes ls ON els.scheme_id = ls.id
        WHERE els.employee_id = $1
        AND els.effective_from <= $2
        AND (els.effective_to IS NULL OR els.effective_to >= $2)
        ORDER BY els.created_at DESC
        LIMIT 1
      `, [employeeId, date]);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'No active leave scheme found for this employee on the specified date'
        };
      }

      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      this.logger.error(`Error fetching current leave scheme for employee ${employeeId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
