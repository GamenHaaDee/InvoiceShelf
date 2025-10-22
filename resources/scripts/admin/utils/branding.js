export const DEFAULT_BRANDING = {
  primaryColor: '#4A3DFF',
  sidebarBackgroundColor: '#FFFFFF',
  sidebarTextColor: '#111827',
}

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const PRIMARY_LIGHT_MIXES = {
  50: 8,
  100: 16,
  200: 24,
  300: 36,
  400: 48,
}

const PRIMARY_DARK_MIXES = {
  600: 10,
  700: 20,
  800: 30,
  900: 40,
  950: 52,
}

function normalizeHex(value, fallback) {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()

  if (!HEX_COLOR_REGEX.test(trimmed)) {
    return fallback
  }

  if (trimmed.length === 4) {
    return (
      '#' +
      trimmed[1] +
      trimmed[1] +
      trimmed[2] +
      trimmed[2] +
      trimmed[3] +
      trimmed[3]
    ).toUpperCase()
  }

  return trimmed.toUpperCase()
}

function hexToRgbComponents(hex) {
  const normalized = hex.toUpperCase()
  const value = normalized.slice(1)
  const expanded =
    value.length === 3
      ? `${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`
      : value

  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  }
}

function toRgbString(color) {
  return `${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}`
}

function mixRgb(colorA, colorB, weight) {
  const ratio = Math.max(Math.min(weight, 100), 0) / 100
  return {
    r: colorA.r * (1 - ratio) + colorB.r * ratio,
    g: colorA.g * (1 - ratio) + colorB.g * ratio,
    b: colorA.b * (1 - ratio) + colorB.b * ratio,
  }
}

function mixHexInternal(hexA, hexB, weight) {
  const rgbA = hexToRgbComponents(hexA)
  const rgbB = hexToRgbComponents(hexB)
  return mixRgb(rgbA, rgbB, weight)
}

function isLightHex(hex) {
  const { r, g, b } = hexToRgbComponents(hex)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance >= 180
}

export function generatePrimaryPalette(hexColor) {
  const baseHex = normalizeHex(hexColor, DEFAULT_BRANDING.primaryColor)
  const palette = {}

  Object.entries(PRIMARY_LIGHT_MIXES).forEach(([stop, weight]) => {
    palette[stop] = mixHexInternal('#FFFFFF', baseHex, weight)
  })

  palette[500] = hexToRgbComponents(baseHex)

  Object.entries(PRIMARY_DARK_MIXES).forEach(([stop, weight]) => {
    palette[stop] = mixHexInternal(baseHex, '#000000', weight)
  })

  return palette
}

export function applyBranding(settings = {}) {
  const root = document.documentElement
  const primaryHex = normalizeHex(
    settings?.brand_primary_color,
    DEFAULT_BRANDING.primaryColor
  )
  const sidebarBackgroundHex = normalizeHex(
    settings?.brand_sidebar_background_color,
    DEFAULT_BRANDING.sidebarBackgroundColor
  )
  const sidebarTextHex = normalizeHex(
    settings?.brand_sidebar_text_color,
    DEFAULT_BRANDING.sidebarTextColor
  )

  const palette = generatePrimaryPalette(primaryHex)

  Object.entries(palette).forEach(([stop, color]) => {
    root.style.setProperty(`--color-primary-${stop}`, toRgbString(color))
  })

  root.style.setProperty('--brand-primary-color-hex', primaryHex)
  root.style.setProperty(
    '--brand-sidebar-background-color',
    toRgbString(hexToRgbComponents(sidebarBackgroundHex))
  )
  root.style.setProperty(
    '--brand-sidebar-text-color',
    toRgbString(hexToRgbComponents(sidebarTextHex))
  )

  const hoverBackground = mixHexInternal(
    sidebarBackgroundHex,
    sidebarTextHex,
    12
  )
  const activeBackground = mixHexInternal(
    sidebarBackgroundHex,
    primaryHex,
    18
  )

  const borderMix = isLightHex(sidebarBackgroundHex)
    ? mixHexInternal(sidebarBackgroundHex, '#000000', 24)
    : mixHexInternal(sidebarBackgroundHex, '#FFFFFF', 18)

  root.style.setProperty(
    '--brand-sidebar-hover-background-color',
    toRgbString(hoverBackground)
  )
  root.style.setProperty(
    '--brand-sidebar-active-background-color',
    toRgbString(activeBackground)
  )
  root.style.setProperty(
    '--brand-sidebar-border-color',
    toRgbString(borderMix)
  )
}

export function sanitizeBrandingPayload(branding) {
  if (!branding || typeof branding !== 'object') {
    return {}
  }

  const sanitized = {}

  const primary = normalizeHex(branding.primary_color, null)
  if (primary) {
    sanitized.primary_color = primary
  }

  const sidebarBackground = normalizeHex(
    branding.sidebar_background_color,
    null
  )
  if (sidebarBackground) {
    sanitized.sidebar_background_color = sidebarBackground
  }

  const sidebarText = normalizeHex(branding.sidebar_text_color, null)
  if (sidebarText) {
    sanitized.sidebar_text_color = sidebarText
  }

  return sanitized
}

export function hexToRgbString(hex, fallback) {
  const normalized = normalizeHex(hex, fallback)
  return toRgbString(hexToRgbComponents(normalized))
}

export function isValidHexColor(value) {
  return typeof value === 'string' && HEX_COLOR_REGEX.test(value.trim())
}

export function normalizeHexColor(value, fallback) {
  return normalizeHex(value, fallback)
}

export function mixHexColors(colorA, colorB, weight, fallbackA, fallbackB) {
  const sanitizedA = normalizeHex(
    colorA,
    fallbackA ?? DEFAULT_BRANDING.primaryColor
  )
  const sanitizedB = normalizeHex(
    colorB,
    fallbackB ?? DEFAULT_BRANDING.primaryColor
  )

  return mixHexInternal(sanitizedA, sanitizedB, weight)
}

export function isLightHexColor(color, fallback) {
  const sanitized = normalizeHex(color, fallback ?? DEFAULT_BRANDING.primaryColor)
  return isLightHex(sanitized)
}
