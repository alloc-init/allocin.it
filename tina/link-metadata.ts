export type LinkMetadata = {
  title?: string;
  description?: string;
  publisher?: string;
  image?: string;
  date?: string;
  category?: "media" | "podcast" | "news";
};

// Public links use a fully qualified hostname. Reject IP literals and local names
// before sharing either a submitted link or a suggested image with another service.
export function publicLinkUrl(rawUrl?: string): string | undefined {
  if (typeof rawUrl !== "string" || rawUrl.length > 4096) return;
  const input = rawUrl.trim();
  if (!/^https?:\/\//i.test(input)) return;
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/\.$/, "");
    if (url.username || url.password || !/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(host)) return;
    if (/\.\d+$|\.(?:arpa|corp|example|home|internal|intranet|invalid|lan|local|localdomain|localhost|onion|private|test)$/i.test(host)) return;
    url.hostname = host;
    url.hash = "";
    return url.href;
  } catch {
    return;
  }
}

export function tinaCoverUrl(rawUrl?: string): string | undefined {
  const href = publicLinkUrl(rawUrl);
  if (!href) return;
  const url = new URL(href);
  if (url.hostname === "pbs.twimg.com" && /^\/(?:media\/[\w-]+|amplify_video_thumb\/\d+\/img\/[\w-]+)$/.test(url.pathname) &&
    /^(?:jpg|jpeg|png|webp)$/.test(url.searchParams.get("format") || "")) {
    // X serves the requested format from the query. Tina needs an image extension to show its preview.
    url.pathname += url.searchParams.get("format") === "png" ? ".png" : ".jpg";
  }
  return url.href;
}

export function text(value: unknown, limit: number): string | undefined {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, limit) || undefined : undefined;
}

export function xPostTitle(description?: string) {
  const excerpt = description?.replace(/https?:\/\/\S+/gi, "").replace(/^(?:@\w+\s+)+/, "").trim();
  if (!excerpt || !/[\p{L}\p{N}]/u.test(excerpt.replace(/@\w+/g, ""))) return;
  if (excerpt.length <= 100) return excerpt;
  const boundary = excerpt.lastIndexOf(" ", 99);
  return boundary > 0 ? excerpt.slice(0, boundary) + "…" : undefined;
}

export function publicationDay(value: unknown): string | undefined {
  if (typeof value !== "string") return;
  const day = /^(\d{4}-\d{2}-\d{2})(?:$|T)/.exec(value)?.[1];
  if (!day) return;
  const parsed = new Date(day);
  if (Number.isFinite(parsed.getTime()) && parsed.toISOString().startsWith(day)) return day;
}
