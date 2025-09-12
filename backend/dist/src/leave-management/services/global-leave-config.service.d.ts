import { Repository } from 'typeorm';
import { GlobalLeaveConfig } from '../entities/global-leave-config.entity';
import { CreateGlobalLeaveConfigDto } from '../dto/create-global-leave-config.dto';
import { UpdateGlobalLeaveConfigDto } from '../dto/update-global-leave-config.dto';
export declare class GlobalLeaveConfigService {
    private globalLeaveConfigRepository;
    constructor(globalLeaveConfigRepository: Repository<GlobalLeaveConfig>);
    create(createGlobalLeaveConfigDto: CreateGlobalLeaveConfigDto): Promise<GlobalLeaveConfig>;
    findAll(): Promise<GlobalLeaveConfig[]>;
    findOne(id: string): Promise<GlobalLeaveConfig>;
    findByKey(key: string): Promise<GlobalLeaveConfig>;
    findByYear(year: number): Promise<GlobalLeaveConfig>;
    update(id: string, updateGlobalLeaveConfigDto: UpdateGlobalLeaveConfigDto): Promise<GlobalLeaveConfig>;
    updateByKey(key: string, updateGlobalLeaveConfigDto: UpdateGlobalLeaveConfigDto): Promise<GlobalLeaveConfig>;
    remove(id: string): Promise<void>;
}
