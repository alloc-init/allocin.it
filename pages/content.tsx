import { InferGetStaticPropsType } from "next";
import { Layout } from "../components/layout";
import { Content } from "../components/posts/content";
import type { MediaCard } from "../components/posts/content";
import { Container } from "../components/utilities/container";
import { Section } from "../components/utilities/section";
import { client } from "../tina/__generated__/client";

export default function ContentPage({ mediaCards }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Section>
        <Container size="large" width="small">
          <Content data={mediaCards} />
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async () => ({
  props: { mediaCards: await getMediaCards() },
});

async function getMediaCards(): Promise<MediaCard[]> {
  const cards: MediaCard[] = [];
  let after: string | undefined;

  do {
    const result = await client.queries.mediaCardsQuery({ after });
    const { edges, pageInfo } = result.data.mediaCardConnection;
    cards.push(...(edges || []).flatMap((edge) => edge?.node ? [edge.node] : []));
    after = pageInfo.hasNextPage ? pageInfo.endCursor : undefined;
  } while (after);

  return cards.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}
