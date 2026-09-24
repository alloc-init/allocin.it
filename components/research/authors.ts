export type ResearchAuthor = {
  name?: string | null;
  avatar?: string | null;
};

type ResearchAuthors = {
  author?: ResearchAuthor | null;
  authors?: ({ author?: ResearchAuthor | null } | null)[] | null;
};

export const getResearchAuthors = (research: ResearchAuthors): ResearchAuthor[] => {
  const authors = (research.authors ?? [])
    .map((item) => item?.author)
    .filter((author): author is ResearchAuthor => Boolean(author?.name?.trim()));

  if (authors.length) return authors;
  return research.author?.name?.trim() ? [research.author] : [];
};
