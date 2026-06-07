export interface OpmetQueryParams {
  reportTypes: string[];
  stations?: string[];
  countries?: string[];
}

export interface OpmetResult {
  placeId: string;
  queryType: string;
  receptionTime: string;
  reportTime: string;
  reportType: string;
  stationId: string;
  text: string;
  textHTML: string;
}
