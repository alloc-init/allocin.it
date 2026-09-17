import { InferGetStaticPropsType } from "next";
import { Layout } from "../components/layout";
import { Posts } from "../components/posts/posts";
import { Container } from "../components/utilities/container";
import { Section } from "../components/utilities/section";
import { client } from "../tina/__generated__/client";

export default function WritingsPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Section>
        <Container size="large" width="small">
          <Posts data={props.data.postConnection.edges} />
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async () => ({
  props: await client.queries.pageQuery(),
});
