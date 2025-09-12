import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Branch } from '../../branch/entities/branch.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  country_name: string;

  @Column({ unique: true, length: 3 })
  country_code: string;

  @Column()
  transaction_currency: string;

  @Column()
  currency_symbol: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  date_format: string;

  @OneToMany(() => Branch, branch => branch.country)
  branches: Branch[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
