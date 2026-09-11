import { Container } from "../components/utilities/container";
import { Section } from "../components/utilities/section";
import { Posts } from "../components/posts/posts";
import { client } from "../tina/__generated__/client";
import { Layout } from "../components/layout";
import { InferGetStaticPropsType } from "next";
import { Papers } from "../components/research/papers";
import { Content } from "../components/posts/content";
import type { MediaCard } from "../components/posts/content";
export default function HomePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const posts = props.data.postConnection.edges;
  const papers = props.data.researchConnection.edges;

  return (
    <Layout>
      <Section className="flex-1">
        <Container size="large" width="small">
          <Papers data={papers} />
          <Posts data={posts} />
          <Content data={props.mediaCards} />
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const [tinaProps, mediaCards] = await Promise.all([
    client.queries.pageQuery(),
    getMediaCards(),
  ]);
  return {
    props: {
      ...tinaProps,
      mediaCards,
    },
  };
};

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

export type ResearchType = InferGetStaticPropsType<
  typeof getStaticProps
>["data"]["postConnection"]["edges"][number];
