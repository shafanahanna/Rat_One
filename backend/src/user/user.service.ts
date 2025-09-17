import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Branch } from '../branch/entities/branch.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    private dataSource: DataSource,
  ) {}

  async findAllWithContext() {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.employee_id,
        u.branch_id,
        u.created_at,
        u.updated_at,
        b.branch_code,
        b.branch_name,
        b.city,
        b.state_province,
        b.country_id,
        c.country_code,
        c.country_name,
        c.transaction_currency,
        c.currency_symbol,
        c.timezone
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      LEFT JOIN countries c ON b.country_id::text = c.id::text
      ORDER BY u.username ASC
    `;

    const users = await this.dataSource.query(query);
    return users;
  }

  async findOneWithContext(id: string) {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.employee_id,
        u.branch_id,
        u.created_at,
        u.updated_at,
        b.branch_code,
        b.branch_name,
        b.city,
        b.state_province,
        b.country_id,
        c.country_code,
        c.country_name,
        c.transaction_currency,
        c.currency_symbol,
        c.timezone
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      LEFT JOIN countries c ON b.country_id::text = c.id::text
      WHERE u.id::text = $1
    `;

    const users = await this.dataSource.query(query, [id]);
    
    if (users.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return users[0];
  }

  async updateUserBranch(userId: string, branchId: string | null) {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if branch exists (if branchId is provided)
    if (branchId) {
      const branch = await this.branchRepository.findOne({ where: { id: branchId } });
      if (!branch) {
        throw new NotFoundException(`Branch with ID ${branchId} not found`);
      }
    }

    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Update user branch assignment
      user.branch_id = branchId;
      user.updated_at = new Date();
      await this.userRepository.save(user);

      // Check if user has an associated employee record
    //   const employeeMapping = await queryRunner.manager.query(
    //     'SELECT employee_id FROM user_employee_mapping WHERE user_id::text = $1',
    //     [userId]
    //   );

    //   const employeeId = employeeMapping.length > 0 ? employeeMapping[0].employee_id : null;

      // If user has an associated employee record, update that too
    //   if (employeeId) {
    //     // Check if employee record exists
    //     const empCheck = await queryRunner.manager.query(
    //       'SELECT id FROM employees WHERE id::text = $1',
    //       [employeeId]
    //     );

    //     if (empCheck.length > 0) {
    //       await queryRunner.manager.query(
    //         `UPDATE employees SET
    //           branch_id = $2,
    //           updated_at = CURRENT_TIMESTAMP
    //         WHERE id::text = $1`,
    //         [employeeId, branchId || null]
    //       );
    //     }
    //   }

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Get updated user with context
      const updatedUser = await this.findOneWithContext(userId);
      return updatedUser;
    } catch (error) {
      // Rollback the transaction
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async bulkUpdateUserBranch(userIds: string[], branchId: string | null) {
    // Check if branch exists (if branchId is provided)
    if (branchId) {
      const branch = await this.branchRepository.findOne({ where: { id: branchId } });
      if (!branch) {
        throw new NotFoundException(`Branch with ID ${branchId} not found`);
      }
    }

    // Update all users
    await this.userRepository.update(
      { id: In(userIds) },
      { branch_id: branchId, updated_at: new Date() }
    );

    // Get updated users with context
    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.branch_id,
        b.branch_name,
        c.country_name,
        c.transaction_currency
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      LEFT JOIN countries c ON b.country_id::text = c.id::text
      WHERE u.id::text = ANY($1::text[])
      ORDER BY u.username ASC
    `;

    const updatedUsers = await this.dataSource.query(query, [userIds]);

    return {
      updated_count: updatedUsers.length,
      users: updatedUsers
    };
  }

  async findByBranch(branchId: string) {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.employee_id,
        u.created_at,
        b.branch_code,
        b.branch_name,
        c.country_name,
        c.transaction_currency
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      LEFT JOIN countries c ON b.country_id::text = c.id::text
      WHERE u.branch_id::text = $1
      ORDER BY u.username ASC
    `;

    const users = await this.dataSource.query(query, [branchId]);
    return users;
  }

  async findByCountry(countryId: string) {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.employee_id,
        u.created_at,
        b.branch_code,
        b.branch_name,
        c.country_name,
        c.transaction_currency
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      LEFT JOIN countries c ON b.country_id::text = c.id::text
      WHERE c.id::text = $1
      ORDER BY u.username ASC
    `;

    const users = await this.dataSource.query(query, [countryId]);
    return users;
  }

  async findUnassigned() {
    const query = `
      SELECT 
        u.id,
        u.username as name,
        u.email,
        u.role,
        u.employee_id,
        u.created_at,
        u.branch_id,
        b.branch_name,
        b.country_id
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      WHERE u.employee_id IS NULL
      AND u.role NOT IN ('Admin', 'Director') -- Exclude both Admin and Director for backward compatibility
      ORDER BY u.username ASC
    `;

    const users = await this.dataSource.query(query);
    return users;
  }

  async getAssignmentStats() {
    // Get assignment stats by country and branch
    const statsQuery = `
      SELECT 
        c.country_name,
        c.transaction_currency,
        b.branch_name,
        b.branch_code,
        COUNT(u.id) as user_count
      FROM countries c
      LEFT JOIN branches b ON c.id::text = b.country_id::text
      LEFT JOIN users u ON b.id::text = u.branch_id::text
      GROUP BY c.id, c.country_name, c.transaction_currency, b.id, b.branch_name, b.branch_code
      ORDER BY c.country_name ASC, b.branch_name ASC
    `;

    // Get unassigned users count
    const unassignedQuery = `
      SELECT COUNT(*) as unassigned_count
      FROM users
      WHERE branch_id IS NULL
    `;

    const [assignments, unassignedResult] = await Promise.all([
      this.dataSource.query(statsQuery),
      this.dataSource.query(unassignedQuery),
    ]);

    return {
      assignments,
      unassigned_count: parseInt(unassignedResult[0].unassigned_count)
    };
  }
}
