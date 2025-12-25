export interface TaxOption {
  label: string;
  value: string;
  rate: number;
}

export const TAX_OPTIONS: TaxOption[] = [
  { label: "No Tax (0%)", value: "none", rate: 0 },
  { label: "Custom Rate", value: "custom", rate: 0 },
  // US States (2024 rates - state level only, local taxes may vary)
  { label: "Alabama (4%)", value: "AL", rate: 4 },
  { label: "Alaska (0%)", value: "AK", rate: 0 },
  { label: "Arizona (5.6%)", value: "AZ", rate: 5.6 },
  { label: "Arkansas (6.5%)", value: "AR", rate: 6.5 },
  { label: "California (7.25%)", value: "CA", rate: 7.25 },
  { label: "Colorado (2.9%)", value: "CO", rate: 2.9 },
  { label: "Connecticut (6.35%)", value: "CT", rate: 6.35 },
  { label: "Delaware (0%)", value: "DE", rate: 0 },
  { label: "Florida (6%)", value: "FL", rate: 6 },
  { label: "Georgia (4%)", value: "GA", rate: 4 },
  { label: "Hawaii (4%)", value: "HI", rate: 4 },
  { label: "Idaho (6%)", value: "ID", rate: 6 },
  { label: "Illinois (6.25%)", value: "IL", rate: 6.25 },
  { label: "Indiana (7%)", value: "IN", rate: 7 },
  { label: "Iowa (6%)", value: "IA", rate: 6 },
  { label: "Kansas (6.5%)", value: "KS", rate: 6.5 },
  { label: "Kentucky (6%)", value: "KY", rate: 6 },
  { label: "Louisiana (4.45%)", value: "LA", rate: 4.45 },
  { label: "Maine (5.5%)", value: "ME", rate: 5.5 },
  { label: "Maryland (6%)", value: "MD", rate: 6 },
  { label: "Massachusetts (6.25%)", value: "MA", rate: 6.25 },
  { label: "Michigan (6%)", value: "MI", rate: 6 },
  { label: "Minnesota (6.875%)", value: "MN", rate: 6.875 },
  { label: "Mississippi (7%)", value: "MS", rate: 7 },
  { label: "Missouri (4.225%)", value: "MO", rate: 4.225 },
  { label: "Montana (0%)", value: "MT", rate: 0 },
  { label: "Nebraska (5.5%)", value: "NE", rate: 5.5 },
  { label: "Nevada (6.85%)", value: "NV", rate: 6.85 },
  { label: "New Hampshire (0%)", value: "NH", rate: 0 },
  { label: "New Jersey (6.625%)", value: "NJ", rate: 6.625 },
  { label: "New Mexico (4.875%)", value: "NM", rate: 4.875 },
  { label: "New York (4%)", value: "NY", rate: 4 },
  { label: "North Carolina (4.75%)", value: "NC", rate: 4.75 },
  { label: "North Dakota (5%)", value: "ND", rate: 5 },
  { label: "Ohio (5.75%)", value: "OH", rate: 5.75 },
  { label: "Oklahoma (4.5%)", value: "OK", rate: 4.5 },
  { label: "Oregon (0%)", value: "OR", rate: 0 },
  { label: "Pennsylvania (6%)", value: "PA", rate: 6 },
  { label: "Rhode Island (7%)", value: "RI", rate: 7 },
  { label: "South Carolina (6%)", value: "SC", rate: 6 },
  { label: "South Dakota (4.5%)", value: "SD", rate: 4.5 },
  { label: "Tennessee (7%)", value: "TN", rate: 7 },
  { label: "Texas (6.25%)", value: "TX", rate: 6.25 },
  { label: "Utah (6.1%)", value: "UT", rate: 6.1 },
  { label: "Vermont (6%)", value: "VT", rate: 6 },
  { label: "Virginia (5.3%)", value: "VA", rate: 5.3 },
  { label: "Washington (6.5%)", value: "WA", rate: 6.5 },
  { label: "West Virginia (6%)", value: "WV", rate: 6 },
  { label: "Wisconsin (5%)", value: "WI", rate: 5 },
  { label: "Wyoming (4%)", value: "WY", rate: 4 },
  { label: "Washington D.C. (6%)", value: "DC", rate: 6 },
];

export function getTaxRateByState(stateValue: string): number {
  const option = TAX_OPTIONS.find((opt) => opt.value === stateValue);
  return option?.rate ?? 0;
}
