import { type LinkMetadata, text, tinaCoverUrl, xPostTitle } from "./link-metadata";

type XPost = {
  type: string;
  id: string;
  text?: string;
  created_timestamp?: number;
  author?: { name?: string };
  media?: {
    all?: { type?: string; url?: string; thumbnail_url?: string }[];
    external?: { thumbnail_url?: string };
  };
  article?: {
    title?: string;
    preview_text?: string;
    content?: { blocks?: { text?: string }[] };
    cover_media?: { media_info?: { original_img_url?: string } };
  };
};

export async function fetchXPreview(url: URL, signal: AbortSignal): Promise<LinkMetadata | undefined> {
  const id = /\/status(?:es)?\/(\d{2,20})(?:\/|$)/.exec(url.pathname)?.[1];
  if (!id) return;
  const response = await fetch(`https://api.fxtwitter.com/2/status/${id}`, {
    signal, credentials: "omit", referrerPolicy: "no-referrer",
  });
  if (!response.ok) return;
  const { code, status: post }: { code?: number; status?: XPost } = await response.json();
  if (code !== 200 || post?.type !== "status" || post.id !== id) return;

  const article = post.article;
  const blocks = Array.isArray(article?.content?.blocks) ? article.content.blocks : [];
  const description = blocks.map(block => text(block?.text, 2500)).find(Boolean) ||
    text(article?.preview_text, 2500) || text(post.text, 2500);
  const articleTitle = text(article?.title, 300);
  const title = articleTitle || xPostTitle(description);
  const media = Array.isArray(post.media?.all) ? post.media.all : [];
  const image = [
    article?.cover_media?.media_info?.original_img_url,
    ...media.map(item => item?.type === "photo" ? item.url : item?.thumbnail_url),
    post.media?.external?.thumbnail_url,
  ].map(tinaCoverUrl).find(Boolean);
  if (!title && !description && !image) return;
  const date = new Date(typeof post.created_timestamp === "number" ? post.created_timestamp * 1000 : NaN);
  return {
    title, description, image,
    publisher: text(post.author?.name, 180),
    date: Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : undefined,
    category: articleTitle ? "news" : undefined,
  };
}
