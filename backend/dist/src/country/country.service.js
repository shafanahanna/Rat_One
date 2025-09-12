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
exports.CountryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const country_entity_1 = require("./entities/country.entity");
const branch_entity_1 = require("../branch/entities/branch.entity");
let CountryService = class CountryService {
    constructor(countryRepository, branchRepository) {
        this.countryRepository = countryRepository;
        this.branchRepository = branchRepository;
    }
    async create(createCountryDto) {
        const existingCountry = await this.countryRepository.findOne({
            where: { country_code: createCountryDto.country_code.toUpperCase() }
        });
        if (existingCountry) {
            throw new common_1.ConflictException('Country code already exists');
        }
        const country = this.countryRepository.create({
            ...createCountryDto,
            country_code: createCountryDto.country_code.toUpperCase(),
            transaction_currency: createCountryDto.transaction_currency.toUpperCase(),
        });
        return this.countryRepository.save(country);
    }
    async findAll() {
        return this.countryRepository.find({
            order: { country_name: 'ASC' }
        });
    }
    async findOne(id) {
        const country = await this.countryRepository.findOne({
            where: { id }
        });
        if (!country) {
            throw new common_1.NotFoundException(`Country with ID ${id} not found`);
        }
        return country;
    }
    async update(id, updateCountryDto) {
        const country = await this.findOne(id);
        if (updateCountryDto.country_code) {
            const duplicateCountry = await this.countryRepository.findOne({
                where: { country_code: updateCountryDto.country_code.toUpperCase() }
            });
            if (duplicateCountry && duplicateCountry.id !== id) {
                throw new common_1.ConflictException('Country code already exists');
            }
            updateCountryDto.country_code = updateCountryDto.country_code.toUpperCase();
        }
        if (updateCountryDto.transaction_currency) {
            updateCountryDto.transaction_currency = updateCountryDto.transaction_currency.toUpperCase();
        }
        Object.assign(country, updateCountryDto);
        return this.countryRepository.save(country);
    }
    async remove(id) {
        const country = await this.findOne(id);
        const branchCount = await this.branchRepository.count({
            where: { country_id: id }
        });
        if (branchCount > 0) {
            throw new common_1.ConflictException('Cannot delete country with existing branches. Please delete or reassign branches first.');
        }
        const deletedCountry = { ...country };
        await this.countryRepository.remove(country);
        return deletedCountry;
    }
};
exports.CountryService = CountryService;
exports.CountryService = CountryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CountryService);
//# sourceMappingURL=country.service.js.map