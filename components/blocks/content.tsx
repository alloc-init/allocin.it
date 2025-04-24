import React from "react";
import { Section } from "../utilities/section";
import { Container } from "../utilities/container";
import { tinaField } from "tinacms/dist/react";
import { Feature } from "../blocks/features";
import type { Template } from "tinacms";
import type { PageBlocksContent } from "../../tina/__generated__/types";
import Terminal from "../utilities/terminal";

export const Content = ({ data }: { data: PageBlocksContent }) => {
  const items = data.items || [];
  const chunk = <T,>(arr: T[], size: number): T[][] =>
    arr.reduce((chunks: T[][], item, idx) => {
      const ci = Math.floor(idx / size);
      if (!chunks[ci]) chunks[ci] = [];
      chunks[ci].push(item);
      return chunks;
    }, [] as T[][]);
  const pairs = chunk(items, 2);

  return (
    <Section color={data.color} className="relative overflow-hidden p-0 min-h-screen">
      {/* Full-screen Terminal, centered */}
      <Terminal
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        prefix="["
        postfix="]"
      />

      {/* Overlay: rows with 3 cols, skip middle */}
      <Container
        size="large"
        className="relative z-10 py-24 text-white flex flex-col gap-y-12"
      >
        {pairs.map((pair, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-3 gap-12 items-center">
            {/* left feature */}
            <div data-tina-field={tinaField(data, `items.${rowIdx * 2}`)}>
              <Feature featuresColor={data.color} data={pair[0]} />
            </div>

            {/* center gap shows logo */}
            <div />

            {/* right feature if present */}
            <div>
              {pair[1] && (
                <div data-tina-field={tinaField(data, `items.${rowIdx * 2 + 1}`)}>
                  <Feature featuresColor={data.color} data={pair[1]} />
                </div>
              )}
            </div>
          </div>
        ))}
      </Container>
    </Section>
  );
};

export const contentBlockSchema: Template = {
  name: "content",
  label: "Content",
  ui: {
    previewSrc: "/blocks/content.png",
    defaultItem: {
      color: "default",
      items: [
        { title: "Feature 1", text: [], icon: { name: "star", style: "float", color: "" } },
        { title: "Feature 2", text: [], icon: { name: "bolt", style: "float", color: "" } },
        { title: "Feature 3", text: [], icon: { name: "check", style: "float", color: "" } }
      ]
    }
  },
  fields: [
    {
      type: "object",
      label: "Feature Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
        defaultItem: {
          title: "New Feature",
          text: [],
          icon: { name: "", style: "float", color: "" }
        }
      },
      fields: [
        {
          type: "object",
          label: "Icon",
          name: "icon",
          ui: { defaultItem: { name: "", style: "float", color: "" } },
          fields: [
            { type: "string", label: "Name", name: "name" },
            { type: "string", label: "Style", name: "style" },
            { type: "string", label: "Color", name: "color" }
          ]
        },
        { type: "string", label: "Title", name: "title" },
        { type: "rich-text", label: "Text", name: "text" }
      ]
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
