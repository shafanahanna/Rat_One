import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique, AfterLoad } from 'typeorm';
import { Employee } from '../../employee/employee.entity';
import { LeaveType } from './leave-type.entity';

@Entity('leave_balances')
@Unique(['employee_id', 'leave_type_id', 'year'])
export class LeaveBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  employee_id: string;

  @Column({ type: 'uuid', nullable: false })
  leave_type_id: string;

  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: false })
  allocated_days: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0 })
  used_days: number;

  // Virtual property for remaining days
  remaining_days: number;

  // Calculate remaining days after loading from database
  @AfterLoad()
  calculateRemainingDays() {
    this.remaining_days = Number(this.allocated_days) - Number(this.used_days);
  }

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => LeaveType, (leaveType) => leaveType.leaveBalances)
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveType;
}
