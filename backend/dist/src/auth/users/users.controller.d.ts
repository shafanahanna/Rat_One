import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    addUser(createUserDto: CreateUserDto): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    getUser(id: string): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    deleteUser(id: string): Promise<{
        status: string;
        message: string;
    }>;
    getUnassignedUsers(): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
}
