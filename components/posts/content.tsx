import React from "react";
import Link from "next/link";
import type { MediaCardsQueryQuery } from "../../tina/__generated__/types";

export type MediaCard =
  MediaCardsQueryQuery["mediaCardConnection"]["edges"][number]["node"];

export const Content = ({ data }: { data: MediaCard[] }) => {
  if (!data.length) return null;

  return (
    <div>
      <h2 className="text-2xl  mb-4 text-white">Content</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-0">
        {data.map((item) => (
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-[208px] flex-col gap-2"
            key={item.id}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-[208px] h-[208px] object-cover"
            />
            <div className="mt-2 flex items-center w-full gap-2">
              <p className="text-sm text-gray-600 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-150">
                {item.title}
              </p>
              <div className="flex-1 border-t-[1px] border-gray-600 dark:border-gray-700"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
