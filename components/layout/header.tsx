"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container } from "../utilities/container";
import { useTheme } from ".";
import { tinaField } from "tinacms/dist/react";
import { GlobalHeader } from "../../tina/__generated__/types";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

const formatHref = (href: string) => {
  if (href.startsWith("http")) {
    return href;
  }

  if (!href || href === "/") {
    return "/";
  }

  return `/${href.replace(/^\/+/, "")}`;
};

export const Header = ({ data }: { data: GlobalHeader }) => {
  const router = useRouter();
  const theme = useTheme();
  const [headerPositionCss, setHeaderPositionCss] = useState(
    " absolute w-full top-0 left-0 bg-none"
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const headerColor = {
    default: "text-black dark:text-white from-gray-50 to-white  bg-[#120f0b]",
    primary: {
      blue: "text-white from-blue-300 to-blue-500",
      teal: "text-white from-teal-400 to-teal-500",
      green: "text-white from-green-400 to-green-500",
      red: "text-white from-red-400 to-red-500",
      pink: "text-white from-pink-400 to-pink-500",
      purple: "text-white from-purple-400 to-purple-500",
      orange: "text-white from-orange-400 to-orange-500",
      yellow: "text-white from-yellow-400 to-yellow-500"
    }
  };

  const headerColorCss =
    data.color === "primary"
      ? headerColor.primary[theme.color]
      : headerColor.default;

  const activeItemClasses = {
    blue: "border-b-3 border-blue-200 text-blue-700 dark:text-blue-300 font-medium dark:border-blue-700",
    teal: "border-b-3 border-teal-200 text-teal-700 dark:text-teal-300 font-medium dark:border-teal-700",
    green:
      "border-b-3 border-green-200 text-green-700 dark:text-green-300 font-medium dark:border-green-700",
    red: "border-b-3 border-red-300 text-red-700 dark:text-green-300 font-medium dark:border-red-700",
    pink: "border-b-3 border-pink-200 text-pink-700 dark:text-pink-300 font-medium dark:border-pink-700",
    purple:
      "border-b-3 border-purple-200 text-purple-700 dark:text-purple-300 font-medium dark:border-purple-700",
    orange:
      "border-b-3 border-orange-200 text-orange-700 dark:text-orange-300 font-medium dark:border-orange-700",
    yellow:
      "border-b-3 border-yellow-300 text-yellow-700 dark:text-yellow-300 font-medium dark:border-yellow-600"
  };

  const activeBackgroundClasses = {
    blue: "text-blue-500",
    teal: "text-teal-500",
    green: "text-green-500",
    red: "text-red-500",
    pink: "text-pink-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
    yellow: "text-yellow-500"
  };
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (router.asPath !== "/") {
      setHeaderPositionCss(" relative");
    }
  }, [router.asPath]);

  return (
    <div className={` overflow-hidden  ${headerColorCss} ${headerPositionCss}`}>
      <Container size="custom" className="py-0 relative z-10 max-w-8xl">
        <div className="flex items-center justify-between gap-6">
          <h4 className="select-none text-lg font-bold tracking-tight my-4 transition duration-150 ease-out transform">
            <Link
              href="/"
              className="flex gap-1 items-center whitespace-nowrap tracking-[.002em]"
            >
              <img
                src={isMobile ? "/logo-large.svg" : "/logo.svg"}
                alt="logo"
                className="md:w-[124px] md:h-[23px] h-[36px] w-[36px]"
              />
            </Link>
          </h4>
          <ul className="flex items-center gap-6 sm:gap-8 lg:gap-10 tracking-[.002em] -mx-4">
            {data.nav &&
              data.nav.map((item, i) => {
                const activeItem =
                  item.href === "" || item.href === "/"
                    ? router.asPath === "/"
                    : router.asPath.includes(item.href) &&
                    isClient &&
                    item.href !== "/";

                const href = formatHref(item.href);
                return (
                  <li
                    key={`${item.label}-${i}`}
                    className={`${
                      activeItem ? activeItemClasses[theme.color] : ""
                    }`}
                  >
                    <Link
                      data-tina-field={tinaField(item, "label")}
                      href={href}
                      className={`relative select-none	text-xs inline-block tracking-wide transition duration-150 ease-out hover:opacity-100 py-8  ${
                        activeItem ? `opacity-50` : ``
                      }`}
                      target={item.href.includes("http") ? "_blank" : "_self"}
                      style={{
                        display: isMobile && href === "/" ? "none" : "block"
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            <li>
              <a
                className="inline-block opacity-80 hover:opacity-100 transition ease-out duration-150 py-8"
                href={data.social.twitter}
                target="_blank"
              >
                <FaTwitter />
              </a>
            </li>
            <li>
              <a
                className="inline-block opacity-80 hover:opacity-100 transition ease-out duration-150 py-8"
                href={data.social.linkedin}
                target="_blank"
              >
                <FaLinkedin />
              </a>
            </li>
          </ul>
        </div>
        {/* <div
          className={`absolute h-1 bg-gradient-to-r from-transparent ${
            data.color === "primary" ? `via-white` : `via-black dark:via-white`
          } to-transparent bottom-0 left-4 right-4 -z-1 opacity-5`}
        /> */}
      </Container>
    </div>
  );
};
