import { Country, State, City } from 'country-state-city';

export type CountryOption = { isoCode: string; name: string };
export type StateOption = { isoCode: string; name: string };
export type CityOption = { name: string };

export function getCountries(): CountryOption[] {
  return Country.getAllCountries()
    .map(c => ({ isoCode: c.isoCode, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getStates(countryCode: string): StateOption[] {
  if (!countryCode) return [];
  return State.getStatesOfCountry(countryCode)
    .map(s => ({ isoCode: s.isoCode, name: s.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCities(countryCode: string, stateCode: string): CityOption[] {
  if (!countryCode || !stateCode) return [];
  return City.getCitiesOfState(countryCode, stateCode)
    .map(c => ({ name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCountryName(isoCode: string): string {
  return Country.getCountryByCode(isoCode)?.name ?? isoCode;
}

export function hasStateDropdown(countryCode: string): boolean {
  return getStates(countryCode).length > 0;
}

export function hasCityDropdown(countryCode: string, stateCode: string): boolean {
  return getCities(countryCode, stateCode).length > 0;
}
