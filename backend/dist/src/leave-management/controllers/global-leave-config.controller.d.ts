import { GlobalLeaveConfigService } from '../services/global-leave-config.service';
import { CreateGlobalLeaveConfigDto } from '../dto/create-global-leave-config.dto';
import { UpdateGlobalLeaveConfigDto } from '../dto/update-global-leave-config.dto';
export declare class GlobalLeaveConfigController {
    private readonly globalLeaveConfigService;
    constructor(globalLeaveConfigService: GlobalLeaveConfigService);
    create(createGlobalLeaveConfigDto: CreateGlobalLeaveConfigDto): Promise<import("../entities/global-leave-config.entity").GlobalLeaveConfig>;
    findAll(year?: string): Promise<import("../entities/global-leave-config.entity").GlobalLeaveConfig | import("../entities/global-leave-config.entity").GlobalLeaveConfig[]>;
    findOne(id: string): Promise<import("../entities/global-leave-config.entity").GlobalLeaveConfig>;
    findByKey(key: string): Promise<import("../entities/global-leave-config.entity").GlobalLeaveConfig>;
    update(id: string, updateGlobalLeaveConfigDto: UpdateGlobalLeaveConfigDto): Promise<import("../entities/global-leave-config.entity").GlobalLeaveConfig>;
    updateByKey(key: string, updateGlobalLeaveConfigDto: UpdateGlobalLeaveConfigDto): Promise<import("../entities/global-leave-config.entity").GlobalLeaveConfig>;
    remove(id: string): Promise<void>;
}
