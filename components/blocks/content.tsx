import React from "react";
import { Container } from "../utilities/container";
import { Section } from "../utilities/section";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { Template } from "tinacms";
import { PageBlocksContent } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Terminal from "../utilities/terminal";

export const Content = ({ data }: { data: PageBlocksContent }) => {
  return (
    <Section color={data.color}>
      <Terminal className="screen flex flex-col items-center justify-center space-y-10 p-[6.5rem]"
                prefix="["
                postfix="]" />
      {/*<Container*/}
      {/*  className={`prose prose-lg  ${*/}
      {/*    data.color === "primary" ? `prose-primary` : `dark:prose-dark`*/}
      {/*  }`}*/}
      {/*  data-tina-field={tinaField(data, "body")}*/}
      {/*  size="large"*/}
      {/*  width="custom">*/}
      {/*  <TinaMarkdown content={data.body} />*/}
      {/*</Container>*/}
    </Section>
  );
};

export const contentBlockSchema: Template = {
  name: "content",
  label: "Content",
  ui: {
    previewSrc: "/blocks/content.png",
    defaultItem: {
      body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede."
    }
  },
  fields: [
    {
      type: "rich-text",
      label: "Body",
      name: "body"
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" }
      ]
    }
  ]
};
