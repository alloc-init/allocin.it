import { categoryFor, publicationDay, publicLinkUrl, text, tinaCoverUrl, xPostTitle, type LinkMetadata } from "./link-metadata";

const placeholderTitle = /^(?:just a moment|attention required|access denied|(?:403 )?forbidden|(?:404 )?page not found|verify (?:you are|you're) human|security (?:check|checkpoint)|checking your browser|(?:log[ -]?in|sign[ -]?in|sign up)(?: (?:to|for) [^|]+)?)[.!…\s]*(?:[-/|:].*)?$/i;

type ReaderPage = {
  httpStatus?: number;
  finalUrl?: string;
  title?: string;
  description?: string;
  publishedTime?: string;
  content?: string;
  metadata?: Record<string, unknown>;
};

const metadataValues = (value: unknown): unknown[] => Array.isArray(value) ? value : [value];

export async function fetchReaderPreview(url: URL, signal: AbortSignal): Promise<LinkMetadata | undefined> {
  const href = publicLinkUrl(url.href);
  if (!href) return;
  const social = /(^|\.)(?:x|twitter)\.com$/.test(url.hostname);
  const postId = social && /\/status(?:es)?\/(\d+)(?:\/|$)/.exec(url.pathname)?.[1];

  const response = await fetch("https://r.jina.ai/", {
    method: "POST",
    headers: { Accept: "application/json" },
    // X post content contains expanded broadcast links that its metadata omits.
    body: new URLSearchParams(postId ? { url: href } : { url: href, targetSelector: "title" }),
    credentials: "omit",
    referrerPolicy: "no-referrer",
    signal,
  });
  if (!response.ok) return;
  const result: { code?: number; data?: ReaderPage } = await response.json();
  const page = result?.data;
  if (result?.code !== 200 || !page || (page.httpStatus != null && (page.httpStatus < 200 || page.httpStatus >= 400))) return;
  const source = page.finalUrl ? publicLinkUrl(page.finalUrl) : href;
  if (!source) return;
  const base = new URL(source);
  if (postId && (!/(^|\.)(?:x|twitter)\.com$/.test(base.hostname) ||
    /\/status(?:es)?\/(\d+)(?:\/|$)/.exec(base.pathname)?.[1] !== postId)) return;
  if (/\/(?:i\/flow\/login|i\/jf\/onboarding|login|signin|sign-in)(?:\/|$)/i.test(base.pathname)) return;

  const meta = page.metadata || {};
  const metaText = (key: string, limit: number) => metadataValues(meta[key]).map(value => text(value, limit)).find(Boolean);
  const pageTitle = text(page.title, 300);
  let title = metaText("og:title", 300) || metaText("twitter:title", 300) || pageTitle;
  let description = metaText("og:description", 2500) || metaText("description", 2500) || text(page.description, 2500);
  if ((!title && !description) || [title, pageTitle].some(value => value && placeholderTitle.test(value))) return;
  if (/(^|\.)(?:x|twitter)\.com$/.test(base.hostname) && /^(?:x|twitter)$/i.test(title || "")) return;

  let image: string | undefined;
  const covers = [meta["og:image:secure_url"], meta["og:image"], meta["og:image:url"], meta["twitter:image"]].flatMap(metadataValues);
  for (const value of covers) {
    const cover = text(value, 4096);
    if (!cover) continue;
    try {
      image = tinaCoverUrl(new URL(cover, base).href);
      if (postId && image && /\/profile_(?:images|banners)\//.test(new URL(image).pathname)) image = undefined;
      if (image) break;
    } catch {
      // An invalid cover URL doesn't invalidate the rest of the card.
    }
  }
  let publisher = metaText("og:site_name", 180) || metaText("application-name", 180);
  let category = categoryFor(base, metaText("og:type", 80)?.toLowerCase() || "");
  if (postId) {
    category = undefined;
    publisher = title?.match(/^(.*?)(?:\s+\(@[^)]+\))?\s+on (?:X|Twitter)(?::|$)/)?.[1] || metaText("twitter:creator", 180);
    const headline = title?.match(/ on (?:X|Twitter): ["“](.*)["”](?:\s*\/\s*(?:X|Twitter))?$/)?.[1];
    const content = page.content || "";
    const postHeading = content.match(/^# (.+?) on (?:X|Twitter): ["“](.+)["”]$/m);
    if (postHeading && postHeading[1] === publisher && postHeading[2].length > (description?.length || 0)) {
      description = text(postHeading[2], 2500);
    }
    title = headline || xPostTitle(description);
    const body = headline ? content.split(`# ${headline}\n`)[1] || content : content;
    const lead = body.trim().split(/\n\s*\n/).find(paragraph => !/^\d+ min read$/.test(paragraph));
    if (headline === description && lead && !/^[#[!*]/.test(lead)) {
      description = text(lead.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\\([*_])/g, "$1"), 2500);
      category = "news";
    }
    // Ignore replies by stopping at the original post's timestamp permalink.
    const end = content.search(new RegExp(`\\]\\(https?://(?:x|twitter)\\.com/[^/\\s)]+/status/${postId}(?:\\?[^)]*)?\\)`));
    const broadcast = end >= 0 && content.slice(0, end).match(/https:\/\/(?:x|twitter)\.com\/i\/broadcasts\/[a-zA-Z0-9]{10,20}(?=[\s)])/u)?.[0];
    if (!image && broadcast && !signal.aborted) {
      const controller = new AbortController();
      const abort = () => controller.abort();
      signal.addEventListener("abort", abort, { once: true });
      const timer = setTimeout(abort, 10000);
      try {
        image = (await fetchReaderPreview(new URL(broadcast), controller.signal))?.image;
      } catch {
        // Keep the post's details when its linked cover is unavailable.
      } finally {
        clearTimeout(timer);
        signal.removeEventListener("abort", abort);
      }
    }
  }
  return {
    title, description, image,
    publisher,
    date: metadataValues(meta["article:published_time"]).map(publicationDay).find(Boolean) || publicationDay(page.publishedTime),
    category,
  };
}
