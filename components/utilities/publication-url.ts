export const getPostUrl = (filename: string): string => `/posts/${encodeURIComponent(filename)}`;

// Papers and companion articles can share the same source filename.
export const getResearchPostSlug = (filename: string): string => `${filename}-paper`;

export const getResearchPostUrl = (filename: string): string => getPostUrl(getResearchPostSlug(filename));
