import { type LinkMetadata, publicLinkUrl, text } from "./link-metadata";

export async function fetchYoutubeSource(url: URL, signal: AbortSignal): Promise<LinkMetadata | undefined> {
  const host = url.hostname.replace(/^(?:www|m|music)\./, "");
  let id: string | null | undefined;
  if (host === "youtu.be") {
    id = url.pathname.split("/")[1];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = url.pathname === "/watch" ? url.searchParams.get("v") : /^\/(?:embed|shorts|live|v)\/([^/]+)/.exec(url.pathname)?.[1];
  }
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;

  const response = await fetch(`/api/content-source?kind=youtube&id=${id}`, { signal, credentials: "omit", referrerPolicy: "no-referrer" });
  if (response.status !== 200 || !response.headers.get("content-type")?.includes("application/json")) return;
  // This same-origin endpoint returns validated metadata for the requested video ID.
  const data: LinkMetadata = await response.json();
  return data?.title || data?.description || data?.image ? data : undefined;
}

export async function fetchYoutubeEmbed(url: URL, signal: AbortSignal): Promise<LinkMetadata | undefined> {
  const endpoint = new URL("https://www.youtube.com/oembed");
  endpoint.search = new URLSearchParams({ url: url.href, format: "json" }).toString();
  const response = await fetch(endpoint, { signal, credentials: "omit", referrerPolicy: "no-referrer" });
  if (!response.ok) return;
  const video = await response.json();
  const title = text(video?.title, 300);
  if (!title) return;
  return { title, publisher: text(video.author_name, 180), image: publicLinkUrl(video.thumbnail_url), category: "media" };
}
