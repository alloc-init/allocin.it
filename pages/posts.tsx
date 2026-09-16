import { useEffect } from "react";
import { useRouter } from "next/router";
import WritingsPage, { getStaticProps } from "./writings";
import type { InferGetStaticPropsType } from "next";

// Preserve the old writing index and bookmarks to its former media section.
export default function PostsPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  useEffect(() => {
    if (router.asPath.split("#")[1] === "content-heading") {
      void router.replace("/content#content-heading");
    }
  }, [router]);

  return <WritingsPage {...props} />;
}

export { getStaticProps };

export type ResearchType = InferGetStaticPropsType<
  typeof getStaticProps
>["data"]["postConnection"]["edges"][number];
