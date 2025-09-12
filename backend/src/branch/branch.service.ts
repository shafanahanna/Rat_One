import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { Country } from '../country/entities/country.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    // Check if country exists
    const country = await this.countryRepository.findOne({ 
      where: { id: createBranchDto.country_id } 
    });
    
    if (!country) {
      throw new NotFoundException(`Country with ID ${createBranchDto.country_id} not found`);
    }

    // Check if branch code already exists
    const existingBranch = await this.branchRepository.findOne({ 
      where: { branch_code: createBranchDto.branch_code } 
    });
    
    if (existingBranch) {
      throw new ConflictException(`Branch with code ${createBranchDto.branch_code} already exists`);
    }

    // Check if manager exists if provided
    if (createBranchDto.manager_user_id) {
      const manager = await this.userRepository.findOne({ 
        where: { id: createBranchDto.manager_user_id } 
      });
      
      if (!manager) {
        throw new NotFoundException(`User with ID ${createBranchDto.manager_user_id} not found`);
      }
    }

    // Create and save the new branch
    const branch = this.branchRepository.create(createBranchDto);
    return this.branchRepository.save(branch);
  }

  async findAll(): Promise<Branch[]> {
    return this.branchRepository.find({
      relations: ['country', 'manager'],
    });
  }

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id },
      relations: ['country', 'manager'],
    });
    
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    
    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.findOne(id);
    
    // Check if country exists if provided
    if (updateBranchDto.country_id) {
      const country = await this.countryRepository.findOne({ 
        where: { id: updateBranchDto.country_id } 
      });
      
      if (!country) {
        throw new NotFoundException(`Country with ID ${updateBranchDto.country_id} not found`);
      }
    }

    // Check if branch code is unique if provided
    if (updateBranchDto.branch_code) {
      const existingBranch = await this.branchRepository.findOne({ 
        where: { branch_code: updateBranchDto.branch_code } 
      });
      
      if (existingBranch && existingBranch.id !== id) {
        throw new ConflictException(`Branch with code ${updateBranchDto.branch_code} already exists`);
      }
    }

    // Check if manager exists if provided
    if (updateBranchDto.manager_user_id) {
      const manager = await this.userRepository.findOne({ 
        where: { id: updateBranchDto.manager_user_id } 
      });
      
      if (!manager) {
        throw new NotFoundException(`User with ID ${updateBranchDto.manager_user_id} not found`);
      }
    }

    // Update branch properties
    Object.assign(branch, updateBranchDto);
    return this.branchRepository.save(branch);
  }

  async remove(id: string): Promise<void> {
    const branch = await this.findOne(id);
    
    // Check if branch has associated users
    const usersCount = await this.userRepository.count({ 
      where: { branch_id: id } 
    });
    
    if (usersCount > 0) {
      throw new ConflictException(`Cannot delete branch with ID ${id} because it has ${usersCount} associated users`);
    }
    
    await this.branchRepository.remove(branch);
  }

  async getBranchesWithUserCount(): Promise<any[]> {
    const branches = await this.branchRepository.find({
      relations: ['country'],
    });

    const branchesWithUserCount = await Promise.all(
      branches.map(async (branch) => {
        const userCount = await this.userRepository.count({
          where: { branch_id: branch.id },
        });

        return {
          ...branch,
          user_count: userCount,
        };
      }),
    );

    return branchesWithUserCount;
  }

  async getBranchByCode(branchCode: string): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { branch_code: branchCode },
      relations: ['country', 'manager'],
    });
    
    if (!branch) {
      throw new NotFoundException(`Branch with code ${branchCode} not found`);
    }
    
    return branch;
  }

  async getBranchesByCountry(countryId: string): Promise<Branch[]> {
    // Check if country exists
    const country = await this.countryRepository.findOne({ 
      where: { id: countryId } 
    });
    
    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    return this.branchRepository.find({
      where: { country_id: countryId },
      relations: ['manager'],
    });
  }
}
