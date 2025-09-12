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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const common_1 = require("@nestjs/common");
const country_service_1 = require("./country.service");
const create_country_dto_1 = require("./dto/create-country.dto");
const update_country_dto_1 = require("./dto/update-country.dto");
let CountryController = class CountryController {
    constructor(countryService) {
        this.countryService = countryService;
    }
    async create(createCountryDto) {
        const country = await this.countryService.create(createCountryDto);
        return { data: country };
    }
    async findAll() {
        const countries = await this.countryService.findAll();
        return { data: countries };
    }
    async findOne(id) {
        const country = await this.countryService.findOne(id);
        return { data: country };
    }
    async update(id, updateCountryDto) {
        const updatedCountry = await this.countryService.update(id, updateCountryDto);
        return { data: updatedCountry };
    }
    async remove(id) {
        const deletedCountry = await this.countryService.remove(id);
        return { data: deletedCountry };
    }
};
exports.CountryController = CountryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_country_dto_1.CreateCountryDto]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_country_dto_1.UpdateCountryDto]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "remove", null);
exports.CountryController = CountryController = __decorate([
    (0, common_1.Controller)('countries'),
    __metadata("design:paramtypes", [country_service_1.CountryService])
], CountryController);
//# sourceMappingURL=country.controller.js.map