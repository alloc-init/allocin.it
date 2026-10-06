import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useTina } from "tinacms/dist/react";
import { Post } from "../../components/posts/post";
import { Paper } from "../../components/research/paper";
import { Layout } from "../../components/layout";
import { getPostUrl } from "../../components/utilities/publication-url";
import { getPublicationRoutes } from "../../lib/publications";
import { client } from "../../tina/__generated__/client";
import type { BlogPostQueryQuery } from "../../tina/__generated__/types";

type ArticleProps = Awaited<ReturnType<typeof client.queries.blogPostQuery>>;
type PaperProps = Awaited<ReturnType<typeof client.queries.paperQuery>>;
type PublicationPageProps =
  | { kind: "post"; slug: string; tina: ArticleProps }
  | { kind: "research"; slug: string; tina: PaperProps };

const PublicationHead = ({ title, slug }: { title: string; slug: string }) => (
  <Head>
    <title>{title} | [[alloc] init]</title>
    <link rel="canonical" href={`https://www.allocinit.xyz${getPostUrl(slug)}`} />
  </Head>
);

function ArticlePage({ tina, slug }: { tina: ArticleProps; slug: string }) {
  const { data } = useTina(tina);
  return (
    <Layout rawData={data} data={data.global}>
      <PublicationHead title={data.post.title} slug={slug} />
      <Post {...data.post} />
    </Layout>
  );
}

function ResearchPage({ tina, slug }: { tina: PaperProps; slug: string }) {
  const { data } = useTina(tina);
  return (
    <Layout rawData={data} data={data.global}>
      <PublicationHead title={data.research.title} slug={slug} />
      <Paper {...data.research} />
    </Layout>
  );
}

export default function PublicationPage(props: PublicationPageProps) {
  return props.kind === "research"
    ? <ResearchPage tina={props.tina} slug={props.slug} />
    : <ArticlePage tina={props.tina} slug={props.slug} />;
}

export const getStaticProps: GetStaticProps<PublicationPageProps, { filename: string }> = async ({ params }) => {
  const routes = await getPublicationRoutes();
  const route = routes.find((item) => item.slug === params?.filename);
  if (!route) return { notFound: true };

  if (route.collection === "research") {
    return { props: { kind: "research", slug: route.slug, tina: await client.queries.paperQuery({ relativePath: route.relativePath }) } };
  }
  return { props: { kind: "post", slug: route.slug, tina: await client.queries.blogPostQuery({ relativePath: route.relativePath }) } };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getPublicationRoutes()).map(({ slug }) => ({ params: { filename: slug } })),
  fallback: "blocking",
});

export type PostType = BlogPostQueryQuery["post"];
