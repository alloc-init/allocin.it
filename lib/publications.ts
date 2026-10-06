import { client } from "../tina/__generated__/client";
import { getResearchPostSlug } from "../components/utilities/publication-url";

type DocumentPath = { filename: string; relativePath: string };
type DocumentPage = {
  edges?: { node?: { _sys: DocumentPath } | null }[] | null;
  pageInfo: { hasNextPage: boolean; endCursor: string };
};
export type PublicationRoute = {
  slug: string;
  collection: "post" | "research";
  relativePath: string;
};

async function getDocuments(loadPage: (after?: string) => Promise<DocumentPage>): Promise<DocumentPath[]> {
  const documents: DocumentPath[] = [];
  let after: string | undefined;
  do {
    const { edges, pageInfo } = await loadPage(after);
    documents.push(...(edges || []).flatMap((edge) => edge?.node ? [edge.node._sys] : []));
    after = pageInfo.hasNextPage ? pageInfo.endCursor : undefined;
  } while (after);
  return documents;
}

export function createPublicationRoutes(posts: DocumentPath[], papers: DocumentPath[]): PublicationRoute[] {
  const routes: PublicationRoute[] = [
    ...posts.map((post) => ({ slug: post.filename, collection: "post" as const, relativePath: post.relativePath })),
    ...papers.map((paper) => ({ slug: getResearchPostSlug(paper.filename), collection: "research" as const, relativePath: paper.relativePath })),
  ];
  const seen = new Set<string>();
  for (const route of routes) {
    if (seen.has(route.slug)) {
      throw new Error(`Duplicate publication URL /posts/${route.slug}. Rename one of the conflicting content files.`);
    }
    seen.add(route.slug);
  }
  return routes;
}

export async function getPublicationRoutes(): Promise<PublicationRoute[]> {
  const [posts, papers] = await Promise.all([
    getDocuments(async (after) => (await client.queries.postConnection({ first: 100, after })).data.postConnection),
    getDocuments(async (after) => (await client.queries.researchConnection({ first: 100, after })).data.researchConnection),
  ]);
  return createPublicationRoutes(posts, papers);
}
