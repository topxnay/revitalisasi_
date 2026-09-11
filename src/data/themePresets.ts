import { AppThemeConfig } from '../types';

export const THEME_PRESETS: AppThemeConfig[] = [
  {
    presetId: 'default',
    name: 'Midnight Slate (Standar)',
    bgColor: '#0f172a',
    textColor: '#f8fafc',
    ambientColor1: 'rgba(99, 102, 241, 0.25)', // indigo
    ambientColor2: 'rgba(16, 185, 129, 0.20)', // emerald
    ambientColor3: 'rgba(6, 182, 212, 0.15)',  // cyan
    isLightMode: false
  },
  {
    presetId: 'obsidian',
    name: 'Deep Obsidian (Hitam Pekat)',
    bgColor: '#030712',
    textColor: '#f9fafb',
    ambientColor1: 'rgba(139, 92, 246, 0.22)', // violet
    ambientColor2: 'rgba(59, 130, 246, 0.20)',  // blue
    ambientColor3: 'rgba(99, 102, 241, 0.16)',
    isLightMode: false
  },
  {
    presetId: 'emerald',
    name: 'Royal Emerald (Hijau Sarpras)',
    bgColor: '#032019',
    textColor: '#f0fdf4',
    ambientColor1: 'rgba(16, 185, 129, 0.28)', // emerald
    ambientColor2: 'rgba(20, 184, 166, 0.22)', // teal
    ambientColor3: 'rgba(52, 211, 153, 0.18)',
    isLightMode: false
  },
  {
    presetId: 'cobalt',
    name: 'Oceanic Cobalt (Biru Laut Kemendikbud)',
    bgColor: '#08172c',
    textColor: '#f0f9ff',
    ambientColor1: 'rgba(37, 99, 235, 0.28)', // blue
    ambientColor2: 'rgba(14, 165, 233, 0.22)', // sky
    ambientColor3: 'rgba(6, 182, 212, 0.18)',
    isLightMode: false
  },
  {
    presetId: 'purple',
    name: 'Imperial Violet (Ungu Aspirasi)',
    bgColor: '#160a24',
    textColor: '#faf5ff',
    ambientColor1: 'rgba(168, 85, 247, 0.26)', // purple
    ambientColor2: 'rgba(236, 72, 153, 0.20)', // pink
    ambientColor3: 'rgba(192, 132, 252, 0.18)',
    isLightMode: false
  },
  {
    presetId: 'charcoal',
    name: 'Carbon Charcoal (Abu Arang)',
    bgColor: '#18181b',
    textColor: '#fafafa',
    ambientColor1: 'rgba(148, 163, 184, 0.20)', // slate
    ambientColor2: 'rgba(99, 102, 241, 0.20)',
    ambientColor3: 'rgba(56, 189, 248, 0.16)',
    isLightMode: false
  },
  {
    presetId: 'maroon',
    name: 'Deep Crimson (Merah Marun)',
    bgColor: '#220b13',
    textColor: '#fff1f2',
    ambientColor1: 'rgba(244, 63, 94, 0.25)', // rose
    ambientColor2: 'rgba(245, 158, 11, 0.18)', // amber
    ambientColor3: 'rgba(251, 113, 133, 0.16)',
    isLightMode: false
  },
  {
    presetId: 'light',
    name: 'Clean Slate Light (Tema Terang)',
    bgColor: '#f1f5f9',
    textColor: '#0f172a',
    ambientColor1: 'rgba(99, 102, 241, 0.14)',
    ambientColor2: 'rgba(14, 165, 233, 0.12)',
    ambientColor3: 'rgba(16, 185, 129, 0.10)',
    isLightMode: true
  }
];

export const DEFAULT_THEME = THEME_PRESETS[0];

export function isColorLight(hexOrRgb: string): boolean {
  if (!hexOrRgb) return false;
  let hex = hexOrRgb.trim().replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
    // Perceived brightness formula (standard weighted luminance)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness >= 135;
  }
  return false;
}
