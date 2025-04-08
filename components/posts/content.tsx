import React from "react";
import Link from "next/link";

const List = [
  {
    img: "/content/interview.png",
    url: "https://x.com/HouseofZK/status/1881298992153203180",
    caption: "House of ZK Radio",
  },
  {
    img: "/content/keynote.png",
    url: "https://blockspace.media/podcast/bitcoin-pipes-with-misha-komarov/",
    caption: "OP_NEXT Keynote",
  },
  {
    img: "/content/podcast.png",
    url: "https://blockspace.media/podcast/bitcoin-pipes-do-everything-on-bitcoin-without-a-soft-fork/",
    caption: "Bitcoin S2 Podcast",
  },
];

export const Content = ({ data }: { data: any }) => {
  return (
    <div>
      <h2 className="text-2xl  mb-4 text-white">Content</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-0">
        {List.map((item, index) => (
          <Link
            href={item.url}
            target="_blank"
            className="flex flex-col gap-2 "
            key={index}
          >
            <img
              src={item.img}
              alt={item.url}
              className="w-[208px] h-[208px]"
            />
            <div className="mt-2 flex items-center w-full gap-2">
              <p className="text-sm text-gray-600 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-150">
                {item.caption}
              </p>
              <div className="flex-1 border-t-[1px] border-gray-600 dark:border-gray-700"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
