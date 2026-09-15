import React from "react";
import Link from "next/link";
import type { MediaCardsQueryQuery } from "../../tina/__generated__/types";

export type MediaCard =
  MediaCardsQueryQuery["mediaCardConnection"]["edges"][number]["node"];

export const Content = ({ data }: { data: MediaCard[] }) => {
  if (!data.length) return null;

  return (
    <section aria-labelledby="content-heading">
      <h2 id="content-heading" className="mb-4 text-2xl text-white">
        Content
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {data.map((item) => {
          const isYouTube = /^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(
            item.url
          );

          return (
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 flex-col overflow-hidden rounded-lg border-[1px] border-[#393029] bg-[#24201d] transition-colors hover:border-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow"
              key={item.id}
            >
              <div className="relative aspect-video overflow-hidden bg-[#191512]">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full ${isYouTube ? "object-cover" : "object-contain"}`}
                />
                {isYouTube && (
                  <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white transition-colors group-hover:bg-yellow group-hover:text-black">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-5 p-5">
                <h3 className="text-lg font-medium leading-snug text-white">
                  {item.title}
                </h3>
                <span className="mt-auto flex items-center justify-between gap-3 text-xs text-yellow">
                  {isYouTube ? "Watch on YouTube" : "Open resource"}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5 shrink-0"
                  >
                    <path d="M6 18 18 6M6 6h12v12" />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
