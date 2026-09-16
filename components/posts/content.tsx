import React from "react";
import Link from "next/link";
import type { MediaCardsQueryQuery } from "../../tina/__generated__/types";

export type MediaCard =
  MediaCardsQueryQuery["mediaCardConnection"]["edges"][number]["node"];

const categories = [
  { id: "media", label: "Media" },
  { id: "podcast", label: "Podcast" },
  { id: "news", label: "News" },
];

export const Content = ({ data }: { data: MediaCard[] }) => {
  if (!data.length) return null;

  return (
    <div id="content-heading">
      {categories.map(({ id, label }) => (
        <div key={id} id={id} className="mb-12">
          <h2 className="text-2xl  mb-4 text-white">{label}</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-0">
            {data.filter((item) => (item.category || "media") === id).map((item) => (
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col gap-2 ${id === "media" ? "w-full sm:w-[calc(50%_-_1rem)]" : "w-[208px]"}`}
                key={item.id}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className={id === "media" ? "w-full h-auto" : "w-[208px] h-[208px] object-cover"}
                  />
                )}
                <div className="mt-2 flex items-center w-full gap-2">
                  <p className="text-sm text-gray-600 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-150">
                    {item.title}
                  </p>
                  <div className="flex-1 border-t-[1px] border-gray-600 dark:border-gray-700"></div>
                </div>
                {item.publisher && <p className="text-sm text-gray-600">{item.publisher}</p>}
                {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
