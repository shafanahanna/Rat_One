import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Designation } from '../../designations/entities/designation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true, length: 100 })
  role: string;

  @Column({ nullable: true })
  employee_id: string;

  @Column({ nullable: true })
  country_id: string;

  @Column({ nullable: true })
  branch_id: string;

  @Column({ nullable: true, name: 'designation_id' })
  designationId: string;

  @ManyToOne(() => Designation)
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}