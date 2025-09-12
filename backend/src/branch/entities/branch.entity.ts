import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Country } from '../../country/entities/country.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country_id: string;

  @Column({ unique: true })
  branch_code: string;

  @Column()
  branch_name: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  state_province: string;

  @Column({ default: false })
  is_headquarters: boolean;

  @Column({ nullable: true })
  manager_user_id: string;

  @ManyToOne(() => Country, country => country.branches)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_user_id' })
  manager: User;

  @OneToMany(() => User, user => user.branch_id)
  users: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
