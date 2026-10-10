import { useEffect } from "react";
import { useRouter } from "next/router";
import type { InferGetStaticPropsType } from "next";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../components/layout";
import { Posts } from "../components/posts/posts";
import { Container } from "../components/utilities/container";
import { Section } from "../components/utilities/section";
import { client } from "../tina/__generated__/client";

export default function PostsPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { data } = useTina(props);

  // Preserve bookmarks to the media section that used to live on this page.
  useEffect(() => {
    if (router.asPath.split("#")[1] === "content-heading") {
      void router.replace("/content#content-heading");
    }
  }, [router]);

  return (
    <Layout rawData={data} data={data.global}>
      <Section>
        <Container size="small" width="medium" className="w-full sm:py-16">
          <Posts data={data.postConnection.edges} research={data.researchConnection.edges} />
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async () => ({
  props: await client.queries.pageQuery(),
});

export type PostListItem = InferGetStaticPropsType<
  typeof getStaticProps
>["data"]["postConnection"]["edges"][number];

export type PaperListItem = InferGetStaticPropsType<
  typeof getStaticProps
>["data"]["researchConnection"]["edges"][number];
