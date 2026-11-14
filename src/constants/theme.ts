export type Tema = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  muted: string;
  primary: string;
  border: string;
  danger: string;
};

export const escuro: Tema = {
  bg: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceAlt: '#282828',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  muted: '#717171',
  primary: '#FF0000',
  border: '#2C2C2C',
  danger: '#FF5252',
};

export const claro: Tema = {
  bg: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceAlt: '#E6E6E6',
  text: '#0F0F0F',
  textSecondary: '#555555',
  muted: '#8A8A8A',
  primary: '#E00000',
  border: '#DDDDDD',
  danger: '#C62828',
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const FONT = { sm: 12, md: 14, lg: 16, xl: 20, xxl: 28 } as const;
export const RADIUS = { sm: 6, md: 10, lg: 16, pill: 999 } as const;
