import type { NextApiRequest, NextApiResponse } from "next";
import { type LinkMetadata, publicationDay, publicLinkUrl, text } from "../../tina/link-metadata";

async function pagePrefix(response: Response, limit: number): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let html = "";
  let size = 0;
  try {
    while (size < limit) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = value.subarray(0, limit - size);
      html += decoder.decode(chunk, { stream: true });
      size += chunk.byteLength;
    }
  } finally {
    void reader.cancel().catch(() => undefined);
  }
  return html + decoder.decode();
}

type Thumbnail = { url?: string; width?: number };

function youtubeDescription(value: unknown): string | undefined {
  if (typeof value !== "string") return;
  const description = value.trim();
  if (!description || /^(?:enjoy the videos and music you love, upload original content|share your videos with friends, family, and the world[.!]?$|sign in to confirm you(?:’|')re not a bot|before you continue to youtube)/i.test(description)) return;
  return description.slice(0, 5000);
}

function videoCover(thumbnails: Thumbnail[], id: string): string | undefined {
  let best: string | undefined;
  let bestWidth = -1;
  for (const thumbnail of thumbnails) {
    const href = publicLinkUrl(thumbnail?.url);
    if (!href) continue;
    const image = new URL(href);
    const [, variant, videoId] = image.pathname.split("/");
    if (image.protocol !== "https:" || !/^(?:i[1-4]?\.ytimg\.com|img\.youtube\.com)$/.test(image.host) ||
      !/^(?:vi|vi_webp|vi_live)$/.test(variant) || videoId !== id) continue;
    const width = Number(thumbnail.width) || 0;
    if (width > bestWidth) {
      best = image.href;
      bestWidth = width;
    }
  }
  return best;
}

function playerResponse(html: string) {
  const assignment = /\bvar\s+ytInitialPlayerResponse\s*=\s*\{/.exec(html);
  if (!assignment) return;
  const start = assignment.index + assignment[0].length - 1;
  let depth = 0;
  let quoted = false;
  let escaped = false;
  // Descriptions can contain braces and JavaScript snippets; only count JSON structure.
  for (let i = start; i < html.length; i++) {
    const char = html[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === "{") depth++;
    else if (char === "}" && --depth === 0) return JSON.parse(html.slice(start, i + 1));
  }
}

function videoMetadata(html: string, id: string): LinkMetadata | undefined {
  const player = playerResponse(html);
  if (player?.playabilityStatus?.status !== "OK" || player?.videoDetails?.videoId !== id) return;
  const video = player.videoDetails;
  const microformat = player.microformat?.playerMicroformatRenderer;
  const thumbnails: Thumbnail[] = [
    ...(Array.isArray(video.thumbnail?.thumbnails) ? video.thumbnail.thumbnails : []),
    ...(Array.isArray(microformat?.thumbnail?.thumbnails) ? microformat.thumbnail.thumbnails : []),
  ];
  const title = text(video.title, 300);
  const description = youtubeDescription(video.shortDescription);
  const image = videoCover(thumbnails, id);
  if (!title && !description && !image) return;
  return {
    title, description, image,
    publisher: text(video.author, 180) || text(microformat?.ownerChannelName, 180),
    date: publicationDay(microformat?.publishDate) || publicationDay(microformat?.uploadDate),
    category: "media",
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }
  const { kind, id } = req.query;
  if (kind !== "youtube" || typeof id !== "string" || !/^[A-Za-z0-9_-]{11}$/.test(id)) return res.status(400).end();
  const source = `https://www.youtube.com/watch?v=${id}`;
  try {
    const page = await fetch(source, { redirect: "error", signal: AbortSignal.timeout(6500) });
    if (!page.ok) return res.status(502).end();
    const html = await pagePrefix(page, 3 * 1024 * 1024);
    const data = videoMetadata(html, id);
    if (!data) return res.status(204).end();
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
    return res.status(200).json(data);
  } catch {
    return res.status(502).end();
  }
}
