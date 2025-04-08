import React from "react";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { TinaTemplate } from "tinacms";
import { PageBlocksContent } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";

export const Content = ({ data }: { data: PageBlocksContent }) => {
  return (
    <Section color={data.color}>
      <div className="relative w-full ">
        <div
          style={{ aspectRatio: 1710 / 673 }}
          className="relative w-full h-[65vh] md:h-auto"
        >
          <Image
            src="/home-bg.png"
            alt="Home Background"
            fill
            className="object-cover"
          />
        </div>
      </div>
      <Image
        src="/logo-large.svg"
        alt="Logo"
        width={236}
        height={265}
        className="absolute w-[236px] h-[265px] left-[calc(50%-118px)] top-[calc(50%-132.5px)]"
      />
      {/* <Container
        className={`prose prose-lg  ${
          data.color === "primary" ? `prose-primary` : `dark:prose-dark`
        }`}
        data-tina-field={tinaField(data, "body")}
        size="large"
        width="custom"
      >
        <TinaMarkdown content={data.body} />
      </Container> */}
    </Section>
  );
};

export const contentBlockSchema: TinaTemplate = {
  name: "content",
  label: "Content",
  ui: {
    previewSrc: "/blocks/content.png",
    defaultItem: {
      body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.",
    },
  },
  fields: [
    {
      type: "rich-text",
      label: "Body",
      name: "body",
    },

    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" },
      ],
    },
  ],
};
