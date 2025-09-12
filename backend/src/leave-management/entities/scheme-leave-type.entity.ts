import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LeaveScheme } from './leave-scheme.entity';
import { LeaveType } from './leave-type.entity';

@Entity('scheme_leave_types')
export class SchemeLeaveType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  scheme_id: string;

  @Column({ type: 'uuid' })
  leave_type_id: string;

  @Column({ type: 'int' })
  days_allowed: number;

  @Column({ default: true })
  is_paid: boolean;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ManyToOne(() => LeaveScheme, scheme => scheme.schemeLeaveTypes)
  @JoinColumn({ name: 'scheme_id' })
  scheme: LeaveScheme;

  @ManyToOne(() => LeaveType)
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveType;
}
