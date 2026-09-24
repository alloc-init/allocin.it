import React from "react";
import Link from "next/link";
import { useTheme } from "../layout";
import format from "date-fns/format";
import { ResearchType } from "../../pages/posts";
import { getExternalUrl } from "../utilities/external-url";

export const Posts = ({ data }: { data: ResearchType[] }) => {
  const theme = useTheme();
  const sortedPosts = [...data].sort((a, b) => {
    const aDate = Date.parse(a.node.date || "");
    const bDate = Date.parse(b.node.date || "");
    if (isNaN(aDate)) return isNaN(bDate) ? 0 : 1;
    if (isNaN(bDate)) return -1;
    return bDate - aDate;
  });
  const titleColorClasses = {
    blue: "group-hover:text-blue-600 dark:group-hover:text-blue-300",
    teal: "group-hover:text-teal-600 dark:group-hover:text-teal-300",
    green: "group-hover:text-green-600 dark:group-hover:text-green-300",
    red: "group-hover:text-red-600 dark:group-hover:text-red-300",
    pink: "group-hover:text-pink-600 dark:group-hover:text-pink-300",
    purple: "group-hover:text-purple-600 dark:group-hover:text-purple-300",
    orange: "group-hover:text-orange-600 dark:group-hover:text-orange-300",
    yellow: "group-hover:text-yellow-500 dark:group-hover:text-yellow-300"
  };

  return (
    <div>
      <h2 className="text-2xl  mb-4 text-white">Blogs</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-0">
        {sortedPosts.map((postData) => {
          const post = postData.node;
          const externalUrl = getExternalUrl(post.externalUrl);
          const date = new Date(post.date || NaN);
          let formattedDate = "";
          if (!isNaN(date.getTime())) {
            formattedDate = format(date, "M/d/yyyy");
          }
          return (
            <div key={post._sys.filename} className="w-full min-w-0 md:w-[350px] mb-8 last:mb-0">
              <Link
                href={externalUrl || `/posts/` + post._sys.filename}
                target={externalUrl ? "_blank" : undefined}
                rel={externalUrl ? "noopener noreferrer" : undefined}
                className="group md:min-h-[208px] dark:bg-[rgb(36,32,29)] flex flex-col px-6 sm:px-8 md:px-4 py-4  rounded-md shadow-sm transition-all duration-150 ease-out hover:shadow-md hover:to-gray-50 dark:hover:to-gray-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <img src="/logo-large.svg" alt="" className="w-8 h-8 shrink-0" />
                  <div className="flex min-w-0 flex-wrap items-center justify-end gap-1">
                    {post.author?.name && (
                      <div className="p-2 bg-[rgb(24,24,24)] text-white text-xs leading-tight">
                        {post.author.name}
                      </div>
                    )}
                    {post.type && (
                      <div className="uppercase p-2 text-xs leading-tight bg-[rgb(57,46,30)] text-yellow">
                        {post.type}
                      </div>
                    )}
                  </div>
                </div>
                <h3
                  className={`text-gray-700 mt-4 md:mt-6 dark:text-white text-2xl lg:text-2xl font-semibold title-font  transition-all duration-150 ease-out ${
                    titleColorClasses[theme.color]
                  }`}
                >
                  {post.title}{" "}
                </h3>
                <p className="text-gray-500 text-sm ">{post.subtitle}</p>
              </Link>
              {formattedDate !== "" && (
                <div className="mt-2 flex items-center w-full gap-2">
                  <p
                    className="text-xs text-gray-400 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-150">
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
