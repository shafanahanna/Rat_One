import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Branch } from '../branch/entities/branch.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    // Check if country code already exists
    const existingCountry = await this.countryRepository.findOne({
      where: { country_code: createCountryDto.country_code.toUpperCase() }
    });
    
    if (existingCountry) {
      throw new ConflictException('Country code already exists');
    }

    // Create new country with uppercase code and currency
    const country = this.countryRepository.create({
      ...createCountryDto,
      country_code: createCountryDto.country_code.toUpperCase(),
      transaction_currency: createCountryDto.transaction_currency.toUpperCase(),
    });
    
    return this.countryRepository.save(country);
  }

  async findAll(): Promise<Country[]> {
    return this.countryRepository.find({
      order: { country_name: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id }
    });
    
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    
    return country;
  }

  async update(id: string, updateCountryDto: UpdateCountryDto): Promise<Country> {
    const country = await this.findOne(id);
    
    // Check if country code is being changed and if new code already exists
    if (updateCountryDto.country_code) {
      const duplicateCountry = await this.countryRepository.findOne({
        where: { country_code: updateCountryDto.country_code.toUpperCase() }
      });
      
      if (duplicateCountry && duplicateCountry.id !== id) {
        throw new ConflictException('Country code already exists');
      }
      
      // Ensure code is uppercase
      updateCountryDto.country_code = updateCountryDto.country_code.toUpperCase();
    }
    
    // Ensure currency is uppercase if provided
    if (updateCountryDto.transaction_currency) {
      updateCountryDto.transaction_currency = updateCountryDto.transaction_currency.toUpperCase();
    }
    
    // Update country properties
    Object.assign(country, updateCountryDto);
    return this.countryRepository.save(country);
  }

  async remove(id: string): Promise<Country> {
    const country = await this.findOne(id);
    
    // Check if country has branches
    const branchCount = await this.branchRepository.count({
      where: { country_id: id }
    });
    
    if (branchCount > 0) {
      throw new ConflictException(
        'Cannot delete country with existing branches. Please delete or reassign branches first.'
      );
    }
    
    const deletedCountry = { ...country };
    await this.countryRepository.remove(country);
    return deletedCountry;
  }
}
