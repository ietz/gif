import { RadioOption } from '../../components/RadioSelect';

export interface SpeedOption extends RadioOption {
  factor: number
}

export const speedOptions: SpeedOption[] = [1.0, 1.5, 2.0, 3.0].map(
  factor => ({factor, id: factor.toString()})
);

export const defaultSpeedOption = speedOptions[0];
