import { Repository } from 'typeorm';
import { CustomRole } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesService {
    private readonly rolesRepository;
    constructor(rolesRepository: Repository<CustomRole>);
    create(createRoleDto: CreateRoleDto): Promise<CustomRole>;
    findAll(): Promise<CustomRole[]>;
    findOne(id: string): Promise<CustomRole>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<CustomRole>;
    remove(id: string): Promise<void>;
}
