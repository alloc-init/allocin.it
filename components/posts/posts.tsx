import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { PaperListItem, PostListItem } from "../../pages/posts";
import { getExternalUrl } from "../utilities/external-url";
import { getResearchFileUrl } from "../research/file-url";
import { getPostUrl, getResearchPostUrl } from "../utilities/publication-url";
import archive from "./content.module.css";
import styles from "./posts.module.css";

const categories = [
  { id: "research", label: "Research papers" },
  { id: "articles", label: "Articles" },
] as const;
type Category = "all" | (typeof categories)[number]["id"];

type Publication = {
  id: string;
  category: Exclude<Category, "all">;
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  href: string;
  newTab: boolean;
  format: string;
};

const articleSource = (url?: string) => {
  if (!url) return "Article";
  const host = new URL(url).hostname;
  return host === "notion.site" || host.endsWith(".notion.site") || host === "www.notion.so"
    ? "Notion"
    : "External article";
};

export const Posts = ({ data, research }: { data: PostListItem[]; research: PaperListItem[] }) => {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let scrollFrame: number;
    const showLinkedSection = () => {
      const id = window.location.hash.slice(1);
      if (id === "posts-heading" || categories.some((item) => item.id === id)) {
        setCategory("all");
        setSearch("");
        window.cancelAnimationFrame(scrollFrame);
        scrollFrame = window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
      }
    };
    showLinkedSection();
    window.addEventListener("hashchange", showLinkedSection);
    return () => {
      window.removeEventListener("hashchange", showLinkedSection);
      window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  const papers: Publication[] = research.flatMap((edge) => {
    const paper = edge?.node;
    if (!paper) return [];
    const href = getResearchFileUrl(paper.filename);
    return [{
      id: `research:${paper._sys.filename}`,
      category: "research",
      title: paper.title,
      subtitle: paper.subtitle,
      author: paper.author?.name,
      date: paper.date,
      href: getResearchPostUrl(paper._sys.filename),
      newTab: false,
      format: /\.pdf(?:[?#]|$)/i.test(href) ? "PDF" : "Paper",
    }];
  });
  const articles: Publication[] = data.flatMap((edge) => {
    const post = edge?.node;
    if (!post) return [];
    const externalUrl = getExternalUrl(post.externalUrl);
    return [{
      id: `post:${post._sys.filename}`,
      category: "articles",
      title: post.title,
      subtitle: post.subtitle,
      author: post.author?.name,
      date: post.date,
      href: getPostUrl(post._sys.filename),
      newTab: false,
      format: articleSource(externalUrl),
    }];
  });
  const publications = [...papers, ...articles].sort((a, b) => {
    const aDate = Date.parse(a.date || "");
    const bDate = Date.parse(b.date || "");
    if (isNaN(aDate)) return isNaN(bDate) ? 0 : 1;
    if (isNaN(bDate)) return -1;
    return bDate - aDate;
  });
  const query = search.trim().toLocaleLowerCase();
  const matches = publications.filter((item) =>
    [item.title, item.subtitle, item.author].some((text) => text?.toLocaleLowerCase().includes(query))
  );
  const groups = categories
    .filter(({ id }) => category === "all" || category === id)
    .map((group) => ({ ...group, items: matches.filter((item) => item.category === group.id) }))
    .filter((group) => group.items.length);
  const resultCount = groups.reduce((count, group) => count + group.items.length, 0);

  const selectCategory = (next: Category) => {
    setCategory(next);
    window.history.replaceState(window.history.state, "", `#${next === "all" ? "posts-heading" : next}`);
  };

  return (
    <div id="posts-heading" className={archive.archive}>
      <header className={archive.header}>
        <h1>Posts</h1>
        <p>Research papers, ideas and updates from our team.</p>
      </header>
      <div className={archive.toolbar}>
        <div className={archive.filters} role="group" aria-label="Filter posts by format">
          {[{ id: "all" as const, label: "All" }, ...categories].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={category === id}
              aria-controls="posts-results"
              onClick={() => selectCategory(id)}
              className={archive.filter}
            >
              {label}
              <span className={archive.count}>
                {id === "all" ? matches.length : matches.filter((item) => item.category === id).length}
              </span>
            </button>
          ))}
        </div>
        <div className={archive.search}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <label htmlFor="posts-search" className="sr-only">Search posts</label>
          <input
            id="posts-search"
            type="search"
            placeholder="Search posts…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-controls="posts-results"
          />
        </div>
      </div>
      <p className={query ? archive.resultSummary : "sr-only"} role="status" aria-live="polite" aria-atomic="true">
        {resultCount} {resultCount === 1 ? "result" : "results"}{query ? ` for “${search.trim()}”` : ""}
      </p>
      <div id="posts-results">
        {groups.map(({ id, label, items }) => (
          <section key={id} id={id} aria-labelledby={`${id}-heading`} className={archive.section}>
            <div className={archive.sectionHeading}>
              <h2 id={`${id}-heading`}>{label}</h2>
              <span>{items.length} {items.length === 1 ? "item" : "items"}</span>
            </div>
            <ul className={archive.list}>
              {items.map((item) => <PublicationRow key={item.id} item={item} />)}
            </ul>
          </section>
        ))}
        {!resultCount && (
          <div className={archive.empty}>
            <h2>No matching posts</h2>
            <p>Try another author, title or topic.</p>
            <button type="button" onClick={() => { selectCategory("all"); setSearch(""); }}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

const PublicationRow = ({ item }: { item: Publication }) => {
  const date = new Date(item.date || NaN);
  const hasDate = !isNaN(date.getTime());
  const shortDate = hasDate ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(date) : "";

  return (
    <li>
      <Link
        href={item.href}
        target={item.newTab ? "_blank" : undefined}
        rel={item.newTab ? "noopener noreferrer" : undefined}
        className={`${archive.row} ${styles.publicationRow}`}
      >
        {hasDate ? (
          <time dateTime={date.toISOString()} className={styles.date}>
            <span>{shortDate}</span>
            <span>{date.getUTCFullYear()}</span>
          </time>
        ) : <span aria-hidden="true" className={styles.date}>—</span>}
        <div className={archive.details}>
          <p className={`${archive.source} ${styles.metadata}`}>
            {item.author && <span>{item.author}</span>}
            <span className={styles.format}>{item.format}</span>
          </p>
          <h3>{item.title}</h3>
          {item.subtitle && <p className={archive.description}>{item.subtitle}</p>}
        </div>
        <span className={archive.action}>
          <span>{item.category === "research" ? "Paper" : "Read"}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={item.newTab ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"} />
          </svg>
          {item.newTab && <span className="sr-only"> (opens in a new tab)</span>}
        </span>
      </Link>
    </li>
  );
};
