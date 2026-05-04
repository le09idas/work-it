import { ColorSchemeName } from 'react-native';

const light = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  muted: '#8E8E93',
  accent: '#007AFF',
  danger: '#FF3B30',
  success: '#34C759',
  border: '#E5E5EA',
};

const dark = {
  bg: '#1C1C1E',
  card: '#2C2C2E',
  text: '#F2F2F7',
  muted: '#8E8E93',
  accent: '#0A84FF',
  danger: '#FF453A',
  success: '#30D158',
  border: '#3A3A3C',
};

export function colors(scheme: ColorSchemeName) {
  return scheme === 'dark' ? dark : light;
}
