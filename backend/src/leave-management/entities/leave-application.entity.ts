import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LeaveType } from './leave-type.entity';
import { Employee } from '../../employee/employee.entity';

@Entity('leave_applications')
export class LeaveApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  employee_id: string;

  @Column({ type: 'uuid', nullable: false })
  leave_type_id: string;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: false })
  working_days: number;

  @Column({ type: 'text', nullable: false })
  reason: string;

  @Column({type: 'text', nullable: true})
  attachment_url: string;

  @Column({type: 'text', nullable: true})
  comments: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne('LeaveType', 'leaveApplications')
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveType;
}
