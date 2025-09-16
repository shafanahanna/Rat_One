import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomRole } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(CustomRole)
    private readonly rolesRepository: Repository<CustomRole>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<CustomRole> {
    const role = this.rolesRepository.create(createRoleDto);
    return await this.rolesRepository.save(role);
  }

  async findAll(): Promise<CustomRole[]> {
    return await this.rolesRepository.find();
  }

  async findOne(id: string): Promise<CustomRole> {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<CustomRole> {
    const role = await this.findOne(id);
    
    // Update role properties
    Object.assign(role, updateRoleDto);
    
    return await this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const result = await this.rolesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
}
