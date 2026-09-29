// Dynamic Theme & Customization Engine for Dress Gallery
// Allows instant real-time changes to colors, fonts, logo, images & content

export const COLOR_PRESETS = [
  {
    id: 'romantic-rose',
    name: '🌸 Romantic Rose (Default)',
    primary: '#c85c7a',
    soft: '#f8dfe7',
    gold: '#c9a45c',
    bg: '#fffaf5',
    dark: '#252126'
  },
  {
    id: 'royal-lavender',
    name: '💜 Royal Lavender',
    primary: '#7c3aed',
    soft: '#ede9fe',
    gold: '#d97706',
    bg: '#faf5ff',
    dark: '#1e1b4b'
  },
  {
    id: 'emerald-boutique',
    name: '🌿 Emerald Luxury',
    primary: '#059669',
    soft: '#d1fae5',
    gold: '#ca8a04',
    bg: '#f0fdf4',
    dark: '#064e3b'
  },
  {
    id: 'burgundy-luxe',
    name: '🍷 Burgundy Velvet',
    primary: '#991b1b',
    soft: '#fee2e2',
    gold: '#b45309',
    bg: '#fef2f2',
    dark: '#1f1315'
  },
  {
    id: 'midnight-gold',
    name: '✨ Midnight Chic',
    primary: '#0f172a',
    soft: '#f1f5f9',
    gold: '#eab308',
    bg: '#f8fafc',
    dark: '#0f172a'
  }
];

export const AVAILABLE_HEADING_FONTS = [
  'Playfair Display',
  'Cinzel',
  'Cormorant Garamond',
  'Lora',
  'Prata',
  'Montserrat'
];

export const AVAILABLE_BODY_FONTS = [
  'Plus Jakarta Sans',
  'Poppins',
  'Montserrat',
  'Inter',
  'Lato'
];

/**
 * Dynamically loads Google Fonts by injecting a <link> element
 */
export function loadGoogleFont(fontName) {
  if (!fontName) return;
  const cleanName = fontName.trim();
  const id = `dg-font-${cleanName.toLowerCase().replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return; // Already loaded

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  const query = cleanName.replace(/\s+/g, '+');
  link.href = `https://fonts.googleapis.com/css2?family=${query}:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap`;
  document.head.appendChild(link);
}

/**
 * Applies all customization variables immediately to document root
 */
export function applyTheme(settings = {}) {
  const root = document.documentElement;

  // 1. Primary Colors
  if (settings.themeColorPrimary) {
    root.style.setProperty('--deep-pink', settings.themeColorPrimary);
  }
  if (settings.themeColorSoft) {
    root.style.setProperty('--soft-pink', settings.themeColorSoft);
  }
  if (settings.themeColorGold) {
    root.style.setProperty('--gold', settings.themeColorGold);
  }
  if (settings.themeColorBg) {
    root.style.setProperty('--cream', settings.themeColorBg);
    document.body.style.backgroundColor = settings.themeColorBg;
  }
  if (settings.themeColorDark) {
    root.style.setProperty('--dark', settings.themeColorDark);
    document.body.style.color = settings.themeColorDark;
  }

  // 2. Heading Font
  if (settings.fontHeading) {
    loadGoogleFont(settings.fontHeading);
    root.style.setProperty('--font-heading', `"${settings.fontHeading}", Georgia, serif`);
  }

  // 3. Body Font
  if (settings.fontBody) {
    loadGoogleFont(settings.fontBody);
    root.style.setProperty('--font-body', `"${settings.fontBody}", system-ui, sans-serif`);
    document.body.style.fontFamily = `"${settings.fontBody}", system-ui, sans-serif`;
  }

  // 4. Website Name / Browser Tab Title
  if (settings.storeName) {
    const subtitle = settings.subtitle || settings.logoSubtitle || 'Shiva Fashion';
    document.title = `${settings.storeName} — ${subtitle} | ${settings.tagline || 'Trendy Fashion'}`;
  }
}
