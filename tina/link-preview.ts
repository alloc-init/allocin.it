import { type LinkMetadata, publicLinkUrl } from "./link-metadata";
import { fetchReaderPreview } from "./reader-link-preview";
import { fetchYoutubeEmbed, fetchYoutubeSource } from "./youtube-link-preview";

// Limit each provider separately so a slow response still leaves time for the fallback.
async function tryPreview(signal: AbortSignal, timeout: number, read: (signal: AbortSignal) => Promise<LinkMetadata | undefined>) {
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, timeout);
  try {
    const preview = await read(controller.signal);
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    return preview;
  } catch (error) {
    if (signal.aborted) throw error;
    return undefined;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
  }
}

export async function fetchLinkMetadata(rawUrl: string, signal: AbortSignal): Promise<LinkMetadata> {
  const href = publicLinkUrl(rawUrl);
  if (!href) throw new Error("Enter a public http:// or https:// link without login details.");
  const url = new URL(href);
  const youtube = /(^|\.)(?:youtube\.com|youtu\.be|youtube-nocookie\.com)$/.test(url.hostname);
  let preview: LinkMetadata | undefined;
  if (youtube) {
    preview = await tryPreview(signal, 9000, (s) => fetchYoutubeSource(url, s));
    if (!preview?.title || !preview.image || !preview.publisher) {
      const embed = await tryPreview(signal, 8000, (s) => fetchYoutubeEmbed(url, s));
      if (embed) {
        preview = {
          ...preview,
          title: preview?.title || embed.title,
          image: preview?.image || embed.image,
          publisher: preview?.publisher || embed.publisher,
          category: "media",
        };
      }
    }
  } else {
    preview = await tryPreview(signal, 28000, (s) => fetchReaderPreview(url, s));
  }
  if (preview) return preview;
  throw new Error("Couldn't read details from this link. You can fill in the fields manually.");
}
