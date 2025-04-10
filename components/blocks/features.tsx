import { Section } from "../util/section";
import { Container } from "../util/container";
import { Icon } from "../util/icon";
import { iconSchema } from "../util/icon";
import {
  PageBlocksFeatures,
  PageBlocksFeaturesItems,
} from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Link from "next/link";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useEffect, useState } from "react";

export const Feature = ({
  featuresColor,
  data,
}: {
  featuresColor: string;
  data: PageBlocksFeaturesItems;
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      data-tina-field={tinaField(data)}
      className="flex-1 flex flex-col gap-6 text-left md:items-center lg:items-start lg:text-left max-w-xl mx-auto border-b-[1px] border-white/10 pb-3 last:border-b-0 md:border-r-[1px] md:border-b-0 last:md:border-r-0"
      style={{ flexBasis: "16rem" }}
    >
      {data.icon && (
        <Icon
          tinaField={tinaField(data, "icon")}
          parentColor={featuresColor}
          data={{ size: "large", ...data.icon }}
        />
      )}
      {data.title && (
        <h3
          data-tina-field={tinaField(data, "title")}
          className="text-sm opacity-50 title-font"
        >
          {data.title}
        </h3>
      )}
      {data.text && (
        <p
          data-tina-field={tinaField(data, "text")}
          className="text-base opacity-80 leading-relaxed prose dark:prose-dark "
        >
          {mounted ? <TinaMarkdown content={data.text} /> : "Loading..."}
        </p>
      )}
    </div>
  );
};

export const Features = ({ data }: { data: PageBlocksFeatures }) => {
  return (
    <Section color={data.color}>
      <Container className={`flex text-white`} size="large">
        <div className="flex flex-col">
          <div className="flex md:items-center flex-col md:flex-row gap-4 justify-between mb-8">
            <h2 className="text-3xl  title-font">Simulation Will Be Orange</h2>
            <Link
              href="/posts/manifesto"
              className="p-4 bg-[rgb(57,46,30)] text-[#dad085] w-[150px]"
            >
              MANIFESTO →
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-8 text-left">
            {data.items &&
              data.items.map(function (block, i) {
                return (
                  <Feature featuresColor={data.color} key={i} data={block} />
                );
              })}
          </div>
        </div>
      </Container>
    </Section>
  );
};

const defaultFeature = {
  title: "Here's Another Feature",
  text: "This is where you might talk about the feature, if this wasn't just filler text.",
  icon: {
    color: "",
    style: "float",
    name: "",
  },
};

export const featureBlockSchema = {
  name: "features",
  label: "Features",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      items: [defaultFeature, defaultFeature, defaultFeature],
    },
  },
  fields: [
    {
      type: "object",
      label: "Feature Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title,
          };
        },
        defaultItem: {
          ...defaultFeature,
        },
      },
      fields: [
        iconSchema,
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "rich-text",
          label: "Text",
          name: "text",
        },
      ],
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
