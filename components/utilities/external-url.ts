export const getExternalUrl = (value?: string | null): string | undefined => {
  const url = value?.trim();
  if (!url) return undefined;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") {
      return parsedUrl.href;
    }
  } catch {
    // Empty or invalid links fall back to the local article.
  }

  return undefined;
};
