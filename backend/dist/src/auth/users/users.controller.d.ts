import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(req: any): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    addUser(req: any, createUserDto: CreateUserDto): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    getUser(req: any, id: string): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    updateUser(req: any, id: string, updateUserDto: UpdateUserDto): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    deleteUser(req: any, id: string): Promise<{
        status: string;
        message: string;
    }>;
    getUnassignedUsers(req: any): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
}
