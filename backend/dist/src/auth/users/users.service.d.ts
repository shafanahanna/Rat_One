import { DatabaseService } from '../database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(createUserDto: CreateUserDto): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: string): Promise<void>;
    getUnassignedUsers(): Promise<any[]>;
}
