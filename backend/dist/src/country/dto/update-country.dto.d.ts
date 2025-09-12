import { CreateCountryDto } from './create-country.dto';
declare const UpdateCountryDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCountryDto>>;
export declare class UpdateCountryDto extends UpdateCountryDto_base {
    country_name?: string;
    country_code?: string;
    transaction_currency?: string;
    currency_symbol?: string;
    timezone?: string;
    date_format?: string;
}
export {};
