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
import type { BlogPostQueryQuery } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { getExternalUrl } from "../utilities/external-url";
import styles from "./publication.module.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const markdownComponents = {
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <span className="flex items-center justify-center">
      <img src={props.src ?? ""} alt={props.alt ?? ""} />
    </span>
  ),
};

export const Post = (props: BlogPostQueryQuery["post"]) => {
  const externalUrl = getExternalUrl(props.externalUrl);
  const host = externalUrl ? new URL(externalUrl).hostname : "";
  const isNotion = host === "notion.site" || host.endsWith(".notion.site") ||
    host === "notion.so" || host.endsWith(".notion.so");
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
          <Link href="/posts#articles" className={styles.backLink}>
            <span aria-hidden="true">←</span> Articles
          </Link>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Article</p>
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
            {externalUrl && (
              <a
                data-tina-field={tinaField(props, "externalUrl")}
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.readLink}
              >
                {isNotion ? "Read on Notion" : "Read original article"}
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={markdownComponents}
            >
              {props._body ?? ""}
            </ReactMarkdown>
          </div>
        </article>
      </Container>
    </Section>
  );
};
