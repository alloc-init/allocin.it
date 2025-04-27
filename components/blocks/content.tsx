import React from "react";
import Link from "next/link";
import { Section } from "../utilities/section";
import { Container } from "../utilities/container";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Icon } from "../utilities/icon";
import type { Template } from "tinacms";
import type {
  PageBlocksContent,
  PageBlocksContentColumnsItems
} from "../../tina/__generated__/types";
import Terminal from "../utilities/terminal";
import format from "date-fns/format";

export const Content = ({ data }: { data: PageBlocksContent }) => {
  const columns = data.columns || [];

  return (
    <Section color={data.color} className="relative overflow-hidden p-0 min-h-[calc(100vh-11rem)]">
      {/* Terminal full-screen background */}
      <Terminal
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        prefix="["
        postfix="]"
      />

      {/* Overlay: two linked columns with center gap */}
      <Container size="large" className="relative z-10 py-24 text-white">
        <div className="grid grid-cols-3 gap-12">
          {/* Left column */}
          <div data-tina-field={tinaField(data, "columns.0")} className="flex flex-col space-y-8">
            {columns[0]?.title && (
              <h2 data-tina-field={tinaField(columns[0], "title")} className="text-2xl font-semibold">
                {columns[0].title}
              </h2>
            )}
            {(columns[0]?.items || []).map((item: PageBlocksContentColumnsItems, idx: number) => {
              const dateObj = new Date(item.date);
              const formatted = !isNaN(dateObj.getTime()) ? format(dateObj, "dd/MM/yyyy") : "";
              return (
                <Link
                  key={idx}
                  href={item.link || "#"}
                  className="block"
                  data-tina-field={tinaField(columns[0], `items.${idx}`)}
                >
                  {item.icon && (
                    <Icon
                      tinaField={tinaField(item, "icon")}
                      parentColor={data.color}
                      data={{ size: "large", ...item.icon }}
                    />
                  )}
                  {item.title && (
                    <h3
                      data-tina-field={tinaField(item, "title")}
                      className="text-sm opacity-50 title-font mt-2"
                    >
                      {item.title}
                    </h3>
                  )}
                  {item.text && (
                    <div
                      data-tina-field={tinaField(item, "text")}
                      className="text-xs text-gray-400 leading-relaxed mt-2"
                    >
                      <TinaMarkdown content={item.text} />
                    </div>
                  )}
                  {formatted && (
                    <div className="mt-3 flex items-center gap-2">
                      <p className="text-xs text-gray-400">{formatted}</p>
                      <div className="flex-1 border-t border-white/20" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Center gap */}
          <div aria-hidden="true" />

          {/* Right column */}
          <div data-tina-field={tinaField(data, "columns.1")} className="flex flex-col space-y-8">
            {columns[1]?.title && (
              <h2 data-tina-field={tinaField(columns[1], "title")} className="text-2xl font-semibold">
                {columns[1].title}
              </h2>
            )}
            {(columns[1]?.items || []).map((item: PageBlocksContentColumnsItems, idx: number) => {
              const dateObj = new Date(item.date);
              const formatted = !isNaN(dateObj.getTime()) ? format(dateObj, "dd/MM/yyyy") : "";
              return (
                <Link
                  key={idx}
                  href={item.link || "#"}
                  className="block"
                  data-tina-field={tinaField(columns[1], `items.${idx}`)}
                >
                  {item.icon && (
                    <Icon
                      tinaField={tinaField(item, "icon")}
                      parentColor={data.color}
                      data={{ size: "large", ...item.icon }}
                    />
                  )}
                  {item.title && (
                    <h3
                      data-tina-field={tinaField(item, "title")}
                      className="text-sm opacity-50 title-font mt-2"
                    >
                      {item.title}
                    </h3>
                  )}
                  {item.text && (
                    <div
                      data-tina-field={tinaField(item, "text")}
                      className="text-xs text-gray-400 leading-relaxed mt-2"
                    >
                      <TinaMarkdown content={item.text} />
                    </div>
                  )}
                  {formatted && (
                    <div className="mt-3 flex items-center gap-2">
                      <p className="text-xs text-gray-400">{formatted}</p>
                      <div className="flex-1 border-t border-white/20" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
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
      columns: [
        { title: "Left Column", items: [] },
        { title: "Right Column", items: [] }
      ]
    }
  },
  fields: [
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" }
      ]
    },
    {
      type: "object",
      label: "Columns",
      name: "columns",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
        defaultItem: {
          title: "New Column",
          items: []
        }
      },
      fields: [
        { type: "string", label: "Title", name: "title" },
        {
          type: "object",
          label: "Items",
          name: "items",
          list: true,
          ui: {
            itemProps: (item) => ({ label: item?.title }),
            defaultItem: {
              icon: { name: "", style: "", color: "" },
              title: "New Item",
              text: [],
              date: new Date().toISOString(),
              link: "#"
            }
          },
          fields: [
            {
              type: "object",
              label: "Icon",
              name: "icon",
              fields: [
                { type: "string", label: "Name", name: "name" },
                { type: "string", label: "Style", name: "style" },
                { type: "string", label: "Color", name: "color" }
              ]
            },
            { type: "string", label: "Title", name: "title" },
            { type: "rich-text", label: "Text", name: "text" },
            { type: "datetime", label: "Date", name: "date" },
            { type: "string", label: "Link", name: "link" }
          ]
        }
      ]
    }
  ]
};
