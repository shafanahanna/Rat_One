"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLeaveBalanceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_leave_balance_dto_1 = require("./create-leave-balance.dto");
class UpdateLeaveBalanceDto extends (0, mapped_types_1.PartialType)(create_leave_balance_dto_1.CreateLeaveBalanceDto) {
}
exports.UpdateLeaveBalanceDto = UpdateLeaveBalanceDto;
//# sourceMappingURL=update-leave-balance.dto.js.map