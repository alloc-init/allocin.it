import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useTina } from "tinacms/dist/react";
import { Post } from "../../components/posts/post";
import { Layout } from "../../components/layout";
import { getPostUrl } from "../../components/utilities/publication-url";
import { getExternalUrl } from "../../components/utilities/external-url";
import { getResearchFileUrl } from "../../components/research/file-url";
import { getPublicationRoutes } from "../../lib/publications";
import { client } from "../../tina/__generated__/client";

type ArticleProps = Awaited<ReturnType<typeof client.queries.blogPostQuery>>;
type PublicationPageProps = { slug: string; tina: ArticleProps };

const PublicationHead = ({ title, slug }: { title: string; slug: string }) => (
  <Head>
    <title>{title} | [[alloc] init]</title>
    <link rel="canonical" href={`https://www.allocinit.xyz${getPostUrl(slug)}`} />
  </Head>
);

export default function ArticlePage({ tina, slug }: PublicationPageProps) {
  const { data } = useTina(tina);
  return (
    <Layout rawData={data} data={data.global}>
      <PublicationHead title={data.post.title} slug={slug} />
      <Post {...data.post} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<PublicationPageProps, { filename: string }> = async ({ params }) => {
  const routes = await getPublicationRoutes();
  const route = routes.find((item) => item.slug === params?.filename);
  if (!route) return { notFound: true };

  if (route.collection === "research") {
    const { data } = await client.queries.paperQuery({ relativePath: route.relativePath });
    return { redirect: { destination: getResearchFileUrl(data.research.filename), permanent: false } };
  }
  const tina = await client.queries.blogPostQuery({ relativePath: route.relativePath });
  const externalUrl = getExternalUrl(tina.data.post.externalUrl);
  if (externalUrl) return { redirect: { destination: externalUrl, permanent: false } };
  return { props: { slug: route.slug, tina } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const routes = await getPublicationRoutes();
  const articles = await Promise.all(routes.filter((route) => route.collection === "post").map(async (route) => {
    const { data } = await client.queries.blogPostQuery({ relativePath: route.relativePath });
    return getExternalUrl(data.post.externalUrl) ? null : { params: { filename: route.slug } };
  }));
  return { paths: articles.filter(Boolean), fallback: "blocking" };
};
