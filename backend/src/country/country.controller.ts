import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';


@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  async create(@Body() createCountryDto: CreateCountryDto) {
    const country = await this.countryService.create(createCountryDto);
    return { data: country };
  }

  @Get()
  async findAll() {
    const countries = await this.countryService.findAll();
    return { data: countries };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const country = await this.countryService.findOne(id);
    return { data: country };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    const updatedCountry = await this.countryService.update(id, updateCountryDto);
    return { data: updatedCountry };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedCountry = await this.countryService.remove(id);
    return { data: deletedCountry };
  }
}
