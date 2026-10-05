import { useEffect } from "react";
import { useRouter } from "next/router";
import type { InferGetStaticPropsType } from "next";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../components/layout";
import { Posts } from "../components/posts/posts";
import { Papers } from "../components/research";
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
        <Container size="large" width="small">
          <h1 className="mb-6 text-4xl text-white">Posts</h1>
          <nav aria-label="Post sections" className="mb-10 flex gap-6 text-[#dad085]">
            <a href="#research" className="hover:underline">Research papers</a>
            <a href="#articles" className="hover:underline">Articles</a>
          </nav>
          <section id="research" aria-label="Research papers" className="scroll-mt-8">
            <Papers data={data.researchConnection.edges} />
          </section>
          <section id="articles" aria-label="Articles" className="scroll-mt-8">
            <Posts data={data.postConnection.edges} />
          </section>
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
