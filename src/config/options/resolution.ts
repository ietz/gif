import { RadioOption } from '../../components/RadioSelect';

export interface ResolutionOption extends RadioOption {
  factor: number;
  text: string;
}

export const resolutionOptions: ResolutionOption[] = [
  {id: 'original', factor: 1., text: 'Original'},
  {id: 'half', factor: 1 / 2, text: 'Half'},
  {id: 'third', factor: 1 / 3, text: 'Third'},
];

export const defaultResolutionOption = resolutionOptions[0];
