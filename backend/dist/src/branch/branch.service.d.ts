import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { Country } from '../country/entities/country.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { User } from '../auth/entities/user.entity';
export declare class BranchService {
    private branchRepository;
    private countryRepository;
    private userRepository;
    constructor(branchRepository: Repository<Branch>, countryRepository: Repository<Country>, userRepository: Repository<User>);
    create(createBranchDto: CreateBranchDto): Promise<Branch>;
    findAll(): Promise<Branch[]>;
    findOne(id: string): Promise<Branch>;
    update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch>;
    remove(id: string): Promise<void>;
    getBranchesWithUserCount(): Promise<any[]>;
    getBranchByCode(branchCode: string): Promise<Branch>;
    getBranchesByCountry(countryId: string): Promise<Branch[]>;
}
