"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleBranchResponseDto = exports.BranchListResponseDto = exports.BranchResponseDto = exports.CountryInfoDto = void 0;
const class_transformer_1 = require("class-transformer");
class CountryInfoDto {
}
exports.CountryInfoDto = CountryInfoDto;
class BranchResponseDto {
}
exports.BranchResponseDto = BranchResponseDto;
__decorate([
    (0, class_transformer_1.Type)(() => CountryInfoDto),
    __metadata("design:type", CountryInfoDto)
], BranchResponseDto.prototype, "country", void 0);
class BranchListResponseDto {
}
exports.BranchListResponseDto = BranchListResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => BranchResponseDto),
    __metadata("design:type", Array)
], BranchListResponseDto.prototype, "data", void 0);
class SingleBranchResponseDto {
}
exports.SingleBranchResponseDto = SingleBranchResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => BranchResponseDto),
    __metadata("design:type", BranchResponseDto)
], SingleBranchResponseDto.prototype, "data", void 0);
//# sourceMappingURL=branch-response.dto.js.map