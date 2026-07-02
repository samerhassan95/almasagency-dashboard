const PRODUCTION_API_URL = "https://almasagency.com/api";
const PRODUCTION_SITE_URL = "https://almasagency.com";

function isLocalDev(): boolean {
  if (typeof window !== "undefined") {
    return window.location.hostname === "localhost";
  }
  return process.env.NODE_ENV === "development";
}

/** API base URL — always production on deployed admin, localhost only in dev */
export function getApiUrl(): string {
  if (isLocalDev()) return "http://localhost:3000/api";
  return PRODUCTION_API_URL;
}

/** Main site origin (no /api suffix) */
export function getSiteUrl(): string {
  if (isLocalDev()) return "http://localhost:3000";
  return PRODUCTION_SITE_URL;
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
  let trimmed = url.trim();

  // Rewrite legacy admin-domain URLs to relative paths
  if (trimmed.includes("admin.almasagency.com")) {
    try {
      trimmed = new URL(trimmed).pathname;
    } catch {
      trimmed = trimmed.replace(/^https?:\/\/admin\.almasagency\.com/, "");
    }
  }

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
  let trimmed = url.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    // Rewrite admin-domain or localhost URLs to main site
    if (
      trimmed.includes("admin.almasagency.com") ||
      trimmed.includes("localhost")
    ) {
      try {
        const path = new URL(trimmed).pathname;
        return `${getSiteUrl()}${normalizeMediaPath(path)}`;
      } catch {
        /* fall through */
      }
    }
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
