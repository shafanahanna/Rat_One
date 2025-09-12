import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { LeaveBalance } from './leave-balance.entity';

@Entity('leave_types')
export class LeaveType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  code: string;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: false })
  max_days: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  color: string;

  @Column({ type: 'boolean', default: true })
  is_paid: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  // Relationships
  @OneToMany('LeaveApplication', 'leaveType')
  leaveApplications: any[]; // Using any[] to avoid circular dependency

  @OneToMany('LeaveBalance', 'leaveType')
  leaveBalances: LeaveBalance[];
}
