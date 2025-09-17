import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designation } from './entities/designation.entity';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { DepartmentsService } from '../departments/departments.service';

@Injectable()
export class DesignationsService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
    private departmentsService: DepartmentsService,
  ) {}

  async create(createDesignationDto: CreateDesignationDto): Promise<Designation> {
    // Validate department if provided
    if (createDesignationDto.departmentId) {
      await this.departmentsService.findOne(createDesignationDto.departmentId);
    }
    
    const designation = this.designationRepository.create(createDesignationDto);
    return this.designationRepository.save(designation);
  }

  async findAll(): Promise<Designation[]> {
    return this.designationRepository.find({
      relations: ['department'],
    });
  }

  async findByDepartment(departmentId: string): Promise<Designation[]> {
    return this.designationRepository.find({
      where: { departmentId },
      relations: ['department'],
    });
  }

  async findOne(id: string): Promise<Designation> {
    const designation = await this.designationRepository.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!designation) {
      throw new NotFoundException(`Designation with ID ${id} not found`);
    }

    return designation;
  }

  async update(id: string, updateDesignationDto: UpdateDesignationDto): Promise<Designation> {
    const designation = await this.findOne(id);
    
    // Validate department if provided
    if (updateDesignationDto.departmentId) {
      await this.departmentsService.findOne(updateDesignationDto.departmentId);
    }
    
    this.designationRepository.merge(designation, updateDesignationDto);
    return this.designationRepository.save(designation);
  }

  async remove(id: string): Promise<void> {
    const designation = await this.findOne(id);
    await this.designationRepository.remove(designation);
  }
}
