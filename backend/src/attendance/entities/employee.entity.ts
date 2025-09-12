import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ name: 'date_of_joining', type: 'date', nullable: true })
  dateOfJoining: Date;
}
