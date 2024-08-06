import { Container } from "../components/util/container";
import { Section } from "../components/util/section";
import { Papers } from "../components/research";
import { client } from "../tina/__generated__/client";
import { Layout } from "../components/layout";
import { InferGetStaticPropsType } from "next";

export default function HomePage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const papers = props.data.researchConnection.edges;

  return (
    <Layout>
      <Section className="flex-1">
        <Container size="large" width="small">
          <Papers data={papers} />
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const tinaProps = await client.queries.pageQuery();
  return {
    props: {
      ...tinaProps
    }
  };
};

export type ResearchType = InferGetStaticPropsType<
  typeof getStaticProps
>["data"]["researchConnection"]["edges"][number];
