import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Branch } from '../branch/entities/branch.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ length: 100, nullable: true })
  department: string;

  @Column({ length: 100, nullable: true })
  designation: string;

  @Column({ name: 'date_of_joining', type: 'date', nullable: true })
  dateOfJoining: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;

  @Column({ name: 'proposed_salary', type: 'decimal', precision: 10, scale: 2, nullable: true })
  proposedSalary: number;

  @Column({ name: 'salary_status', length: 50, default: 'Approved' })
  salaryStatus: string;

  @Column({ name: 'emp_code', length: 20, nullable: true })
  empCode: string;

  @Column({ name: 'branch_id', nullable: true })
  branchId: string;

  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;
  
  
  
  @Column({ name: 'profile_picture', length: 255, nullable: true })
  profilePicture: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
