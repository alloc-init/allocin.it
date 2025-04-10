import React from "react";
import Link from "next/link";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { BsArrowRight } from "react-icons/bs";
import { useTheme } from "../layout";
import format from "date-fns/format";
import { ResearchType } from "../../pages/research";

export const Papers = ({ data }: { data: ResearchType[] }) => {
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

  return (
    <div className="mb-12">
      <h2 className="text-2xl  mb-4 text-white">Research</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-0">
        {data.map((researchData) => {
          const research = researchData.node;
          const date = new Date(research.date);
          let formattedDate = "";
          if (!isNaN(date.getTime())) {
            formattedDate = format(date, "M/d/yyyy");
          }
          return (
            <div className="md:w-[350px]  mb-8 last:mb-0 ">
              <Link
                target="_blank"
                key={research.filename}
                href={`/research/` + research.filename}
                className="group md:h-[208px] dark:bg-[rgb(36,32,29)] flex flex-col px-6 sm:px-8 md:px-4 py-4  rounded-md shadow-sm transition-all duration-150 ease-out hover:shadow-md hover:to-gray-50 dark:hover:to-gray-800"
              >
                <div className="flex items-center justify-between">
                  <img src="/logo_small.png" alt="" className="w-8 h-8" />
                  <div className="flex items-center gap-1">
                    <div className="p-2 bg-[rgb(24,24,24)] text-white text-xs leading-tight">
                      {research.author?.name}
                    </div>
                    <div className="uppercase p-2 text-xs leading-tight bg-[rgb(57,46,30)] text-yellow">
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
                <div className="mt-2 flex items-center w-full gap-2">
                  <p className="text-xs text-gray-600 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-150">
                    {formattedDate}
                  </p>
                  <div className="flex-1 border-t-[1px] border-gray-600 dark:border-gray-700"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
