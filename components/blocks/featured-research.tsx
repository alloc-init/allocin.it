// components/blocks/featured-research-block.tsx
import type { Template } from "tinacms";

// components/blocks/featured-research-block.tsx
import { Section } from "../util/section";
import { Container } from "../util/container";
import { tinaField } from "tinacms/dist/react";
import Link from "next/link";
import { Research } from "../../tina/__generated__/types";
import { useTheme } from "../layout";
import format from "date-fns/format";

interface ResearchItemProps {
  data: Research;
}

const ResearchItem = ({ data }: ResearchItemProps) => {
  const research = data;
  const date = new Date(research.date);
  let formattedDate = "";
  if (!isNaN(date.getTime())) {
    formattedDate = format(date, "dd/MM/yyyy");
  }
  const theme = useTheme();
  const titleColorClasses = {
    blue: "group-hover:text-blue-600 dark:group-hover:text-blue-300",
    teal: "group-hover:text-teal-600 dark:group-hover:text-teal-300",
    green: "group-hover:text-green-600 dark:group-hover:text-green-300",
    red: "group-hover:text-red-600 dark:group-hover:text-red-300",
    pink: "group-hover:text-pink-600 dark:group-hover:text-pink-300",
    purple: "group-hover:text-purple-600 dark:group-hover:text-purple-300",
    orange: "group-hover:text-orange-600 dark:group-hover:text-orange-300",
    yellow: "group-hover:text-yellow-500 dark:group-hover:text-yellow-300",
  };
  return data ? (
    <div className="md:w-[350px]  mb-8 last:mb-0 ">
      <Link
        key={research.filename}
        href={`/research/` + research.filename}
        className="group md:h-[208px] dark:bg-white/5 flex flex-col px-6 sm:px-8 md:px-4 py-4  rounded-md shadow-sm transition-all duration-150 ease-out hover:shadow-md hover:to-gray-50 dark:hover:to-gray-800"
      >
        <div className="flex items-center justify-between">
          <img src="/logo_small.png" alt="" className="w-8 h-8" />
          <div className="flex items-center gap-1">
            <div className="p-2 bg-black text-white text-xs leading-tight">
              {research.author?.name}
            </div>
            <div className="uppercase p-2 text-xs leading-tight bg-yellow/20 text-yellow">
              {research.type}
            </div>
          </div>
        </div>
        <h3
          className={`text-gray-700 mt-auto dark:text-white text-2xl lg:text-2xl font-semibold title-font  transition-all duration-150 ease-out ${
            titleColorClasses[theme.color]
          }`}
        >
          {research.title}{" "}
        </h3>
        <p className="text-gray-500 text-sm ">{research.subtitle}</p>
      </Link>
      {formattedDate !== "" && (
        <div className="mt-2 flex items-center w-full">
          <p className="text-xs text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-150">
            {formattedDate}
          </p>
          <div className="flex-1 border-t-[1px] border-gray-200 dark:border-gray-700"></div>
        </div>
      )}
    </div>
  ) : null;
};

export const FeaturedResearchBlock = ({ data }) => {
  const researchItems = data.researchItems?.map((item) => item.research) || [];
  return (
    <Section color={data.color}>
      <Container size="large">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl font-semibold"
            data-tina-field={tinaField(data, "title")}
          >
            {data.title}
          </h2>
          <Link href={data.viewAllLink}>
            <span className="text-orange-500 hover:text-orange-600">
              VIEW ALL →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchItems.map((item, index) => (
            <ResearchItem key={index} data={item} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
export const featuredResearchBlockSchema: Template = {
  name: "featured_research",
  label: "Featured Research",
  ui: {
    previewSrc: "/blocks/featured-research.png",
  },
  fields: [
    {
      type: "string",
      label: "Section Title",
      name: "title",
    },
    {
      type: "object",
      label: "Research Items",
      name: "researchItems", // 改名以避免冲突
      list: true,
      fields: [
        {
          type: "reference",
          label: "Research",
          name: "research",
          collections: ["research"],
        },
      ],
    },
    {
      type: "string",
      label: "View All Link",
      name: "viewAllLink",
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Primary", value: "primary" },
      ],
    },
  ],
};
