import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Branch } from '../branch/entities/branch.entity';
export declare class CountryService {
    private countryRepository;
    private branchRepository;
    constructor(countryRepository: Repository<Country>, branchRepository: Repository<Branch>);
    create(createCountryDto: CreateCountryDto): Promise<Country>;
    findAll(): Promise<Country[]>;
    findOne(id: string): Promise<Country>;
    update(id: string, updateCountryDto: UpdateCountryDto): Promise<Country>;
    remove(id: string): Promise<Country>;
}
