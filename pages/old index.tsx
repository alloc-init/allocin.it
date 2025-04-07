import { Container } from "../components/util/container";
import { Section } from "../components/util/section";
import { client } from "../tina/__generated__/client";

import { Layout } from "../components/layout";
import { InferGetStaticPropsType } from "next";
import { Papers } from "../components/research/papers-new";
import Image from "next/image";
export default function HomePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const papers = props.data.researchConnection.edges;
  return (
    <Layout>
      <Section className="flex-1">
        <div className="relative w-full overflow-hidden h-[65vh]">
          <div
            style={{ aspectRatio: 1710 / 673 }}
            className="relative w-full overflow-hidden"
          >
            <Image
              src="/home-bg.png"
              alt="Home Background"
              fill
              className="object-cover"
            />
          </div>
          <Image
            src="/logo-large.svg"
            alt="Logo"
            width={236}
            height={265}
            className="absolute w-[236px] h-[265px] left-[calc(50%-118px)] top-[calc(50%-132.5px)]"
          />
        </div>
        <Container size="large" width="custom">
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
      ...tinaProps,
    },
  };
};
