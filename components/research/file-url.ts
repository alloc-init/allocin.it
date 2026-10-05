import { getExternalUrl } from "../utilities/external-url";

export const getResearchFileUrl = (filename: string): string => {
  const externalUrl = getExternalUrl(filename);
  if (externalUrl) return externalUrl;

  // Older CMS entries store paths such as ../../uploads/paper.pdf.
  const { pathname, search, hash } = new URL(filename, "https://www.allocinit.xyz/research/");
  return `${pathname}${search}${hash}`;
};
