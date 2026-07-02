const PRODUCTION_API_URL = "https://almasagency.com/api";
const PRODUCTION_SITE_URL = "https://almasagency.com";

/** API base URL — works in server components and client components */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.hostname === "localhost"
      ? "http://localhost:3000/api"
      : process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL;
}

/** Main site origin (no /api suffix) */
export function getSiteUrl(): string {
  const fromApi = getApiUrl().replace(/\/api\/?$/, "");
  return fromApi || PRODUCTION_SITE_URL;
}

export function getApiKey(): string {
  return (
    process.env.NEXT_PUBLIC_ADMIN_API_KEY ||
    process.env.ADMIN_API_KEY ||
    "almasa_secret_key_2025"
  );
}

/** Normalize stored media paths to /uploads/file.ext */
export function normalizeMediaPath(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed.replace(/\/+$/, "");
  }
  const withoutTrailing = trimmed.replace(/\/+$/, "");
  return withoutTrailing.startsWith("/")
    ? withoutTrailing
    : `/${withoutTrailing}`;
}

/** Build full URL for preview/display from admin (files live on main site) */
export function getFullMediaUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed.replace(/\/+$/, "");
  }
  return `${getSiteUrl()}${normalizeMediaPath(trimmed)}`;
}

export const config = {
  get apiUrl() {
    return getApiUrl();
  },
  get apiKey() {
    return getApiKey();
  },
  get siteUrl() {
    return getSiteUrl();
  },
  getFullImageUrl: getFullMediaUrl,
  normalizeMediaPath,
};
