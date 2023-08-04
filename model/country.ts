import { Country } from "@prisma/client";

export type GetCountryResponse = Country;

export type GetCountriesResponse = GetCountryResponse[];
