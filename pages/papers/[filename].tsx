import { Paper } from "../../components/research/paper";
import { client } from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";
import { InferGetStaticPropsType } from "next";

// Use the props returned by get static props
export default function PaperPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  if (data && data.research) {
    return (
      <Layout rawData={data} data={data.global}>
        <Paper {...data.research} />
      </Layout>
    );
  }
  return (
    <Layout>
      <div>No data</div>;
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.paperQuery({
    relativePath: `${params.filename}.mdx`,
  });
  return {
    props: {
      ...tinaProps,
    },
  };
};

/**
 * To build the blog post pages we just iterate through the list of
 * posts and provide their "filename" as part of the URL path
 *
 * So a blog post at "content/posts/hello.md" would
 * be viewable at http://localhost:3000/posts/hello
 */
export const getStaticPaths = async () => {
  const papersListData = await client.queries.researchConnection();
  return {
    paths: papersListData.data.researchConnection.edges.map((paper) => ({
      params: { filename: paper.node._sys.filename },
    })),
    fallback: "blocking",
  };
};

export type ResearchType = InferGetStaticPropsType<
  typeof getStaticProps
>["data"]["research"];