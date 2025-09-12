import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LeaveScheme } from './leave-scheme.entity';
import { Employee } from '../../employee/employee.entity';

@Entity('employee_leave_schemes')
export class EmployeeLeaveScheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  employee_id: string;

  @Column({ type: 'uuid' })
  scheme_id: string;

  @Column({ type: 'timestamp with time zone' })
  effective_from: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  effective_to: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => LeaveScheme, scheme => scheme.employeeLeaveSchemes)
  @JoinColumn({ name: 'scheme_id' })
  scheme: LeaveScheme;
}
