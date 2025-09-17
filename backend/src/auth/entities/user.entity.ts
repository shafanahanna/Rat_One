import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  // Role column has been removed from the database
  // Role is now managed through the user_roles table

  @Column({ nullable: true })
  employee_id: string;

  @Column({ nullable: true })
  country_id: string;

  @Column({ nullable: true })
  branch_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}