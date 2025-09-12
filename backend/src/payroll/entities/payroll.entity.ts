import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employee/employee.entity';

@Entity('payroll')
export class Payroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column({ name: 'basic_salary', type: 'decimal', precision: 10, scale: 2 })
  basicSalary: number;
  
  @Column({ name: 'allowances', type: 'decimal', precision: 10, scale: 2, default: 0 })
  allowances: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deductions: number;

  @Column({ name: 'unpaid_days', type: 'decimal', precision: 5, scale: 2, default: 0 })
  unpaidDays: number;

  @Column({ name: 'net_salary', type: 'decimal', precision: 10, scale: 2 })
  netSalary: number;
  
  @Column({ name: 'payment_date', type: 'date', nullable: true })
  paymentDate: Date;

  @Column({ name: 'payment_status', default: 'Pending', length: 50 })
  paymentStatus: string;
  
  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
