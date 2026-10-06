/**
 Copyright 2021 Forestry.io Holdings, Inc.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import React from "react";
import Link from "next/link";
import { Container } from "../utilities/container";
import { Section } from "../utilities/section";
import format from "date-fns/format";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Prism } from "tinacms/dist/rich-text/prism";
import type { TinaMarkdownContent, Components } from "tinacms/dist/rich-text";
import type { PaperQueryQuery } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { getResearchFileUrl } from "./file-url";
import styles from "../posts/publication.module.css";

const components: Components<{
  BlockQuote: {
    children: TinaMarkdownContent;
    authorName: string;
  };
  DateTime: {
    format?: string;
  };
  NewsletterSignup: {
    placeholder: string;
    buttonText: string;
    children: TinaMarkdownContent;
    disclaimer?: TinaMarkdownContent;
  };
}> = {
  code_block: (props) => <Prism {...props} />,
  BlockQuote: (props: {
    children: TinaMarkdownContent;
    authorName: string;
  }) => {
    return (
      <div>
        <blockquote>
          <TinaMarkdown content={props.children} />
          {props.authorName}
        </blockquote>
      </div>
    );
  },
  DateTime: (props) => {
    const dt = React.useMemo(() => {
      return new Date();
    }, []);

    switch (props.format) {
      case "iso":
        return <span>{format(dt, "yyyy-MM-dd")}</span>;
      case "utc":
        return <span>{format(dt, "eee, dd MMM yyyy HH:mm:ss OOOO")}</span>;
      case "local":
        return <span>{format(dt, "P")}</span>;
      default:
        return <span>{format(dt, "P")}</span>;
    }
  },
  NewsletterSignup: (props) => {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="">
            <TinaMarkdown content={props.children} />
          </div>
          <div className="mt-8 ">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:max-w-xs rounded-md"
                placeholder={props.placeholder}
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-3 px-5 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  {props.buttonText}
                </button>
              </div>
            </form>
            <div className="mt-3 text-sm text-gray-500">
              {props.disclaimer && <TinaMarkdown content={props.disclaimer} />}
            </div>
          </div>
        </div>
      </div>
    );
  },
  img: (props) => (
    <span className="flex items-center justify-center">
      <img src={props.url} alt={props.alt} />
    </span>
  )
};

export const Paper = (props: PaperQueryQuery["research"]) => {
  const author = props.author;
  const date = new Date(props.date || NaN);
  let formattedDate = "";
  if (!isNaN(date.getTime())) {
    formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  return (
    <Section className="flex-1">
      <Container width="small" size="custom" className={styles.publication}>
        <article>
          <Link href="/posts#research" className={styles.backLink}>
            <span aria-hidden="true">←</span> Research papers
          </Link>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Research paper</p>
            <h1 data-tina-field={tinaField(props, "title")} className={styles.title}>
              {props.title}
            </h1>
            {props.subtitle && (
              <p data-tina-field={tinaField(props, "subtitle")} className={styles.description}>
                {props.subtitle}
              </p>
            )}
            <div className={styles.metadata}>
              {author?.name?.trim() && (
                <span data-tina-field={tinaField(props, "author")}>
                  <span data-tina-field={tinaField(author, "name")}>{author.name}</span>
                </span>
              )}
              {author?.name?.trim() && formattedDate && <span aria-hidden="true">·</span>}
              {formattedDate && (
                <time dateTime={date.toISOString()} data-tina-field={tinaField(props, "date")}>
                  {formattedDate}
                </time>
              )}
            </div>
            <a
              data-tina-field={tinaField(props, "filename")}
              href={getResearchFileUrl(props.filename)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readLink}
            >
              Read PDF <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </header>
          {props.heroImg && (
            <div data-tina-field={tinaField(props, "heroImg")} className={styles.hero}>
              <img src={props.heroImg} alt={props.title} />
            </div>
          )}
          <div
            data-tina-field={tinaField(props, "_body")}
            className={`prose dark:prose-dark w-full max-w-none ${styles.body}`}
          >
            <TinaMarkdown components={components} content={props._body} />
          </div>
        </article>
      </Container>
    </Section>
  );
};
