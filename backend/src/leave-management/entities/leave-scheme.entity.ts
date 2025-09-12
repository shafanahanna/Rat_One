import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { EmployeeLeaveScheme } from './employee-leave-scheme.entity';
import { SchemeLeaveType } from './scheme-leave-type.entity';

@Entity('leave_schemes')
export class LeaveScheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => SchemeLeaveType, schemeLeaveType => schemeLeaveType.scheme)
  schemeLeaveTypes: SchemeLeaveType[];

  @OneToMany(() => EmployeeLeaveScheme, employeeLeaveScheme => employeeLeaveScheme.scheme)
  employeeLeaveSchemes: EmployeeLeaveScheme[];
}
