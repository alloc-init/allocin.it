import React, { useEffect, useState } from "react";
import type { MediaCardsQueryQuery } from "../../tina/__generated__/types";
import styles from "./content.module.css";

export type MediaCard =
  MediaCardsQueryQuery["mediaCardConnection"]["edges"][number]["node"];

const categories = [
  { id: "media", label: "Interviews & talks" },
  { id: "podcast", label: "Podcasts" },
  { id: "news", label: "Coverage" },
] as const;

type Category = "all" | (typeof categories)[number]["id"];
const getCategory = (item: MediaCard) => item.category || "media";

const getHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const getSource = (item: MediaCard) => {
  if (item.publisher?.trim()) return item.publisher;
  const host = getHost(item.url);
  if (host === "youtube.com" || host === "youtu.be") return "YouTube";
  if (host === "twitter.com" || host === "x.com") return "X";
  return host;
};

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 18 18 6M6 6h12v12" />
  </svg>
);

export const Content = ({ data }: { data: MediaCard[] }) => {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  // Old section links also work after using the filters on this page.
  useEffect(() => {
    let scrollFrame: number;
    const showLinkedSection = () => {
      const id = window.location.hash.slice(1);
      if (id === "content-heading" || categories.some((item) => item.id === id)) {
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

  const query = search.trim().toLocaleLowerCase();
  const matches = data.filter((item) =>
    [item.title, getSource(item), item.description].some((text) =>
      text?.toLocaleLowerCase().includes(query)
    )
  );
  const visibleGroups = categories
    .filter(({ id }) => category === "all" || category === id)
    .map((group) => ({
      ...group,
      items: matches.filter((item) => getCategory(item) === group.id),
    }))
    .filter((group) => group.items.length);
  const resultCount = visibleGroups.reduce((count, group) => count + group.items.length, 0);
  const filters = [{ id: "all" as const, label: "All" }, ...categories];

  const selectCategory = (next: Category) => {
    setCategory(next);
    window.history.replaceState(window.history.state, "", `#${next === "all" ? "content-heading" : next}`);
  };

  const reset = () => {
    selectCategory("all");
    setSearch("");
  };

  return (
    <div id="content-heading" className={styles.archive}>
      <header className={styles.header}>
        <h1>Media</h1>
        <p>Talks, interviews and coverage of our work.</p>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter media by format">
          {filters.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={category === id}
              aria-controls="media-results"
              onClick={() => selectCategory(id)}
              className={styles.filter}
            >
              {label}
              <span className={styles.count}>
                {id === "all" ? matches.length : matches.filter((item) => getCategory(item) === id).length}
              </span>
            </button>
          ))}
        </div>
        <div className={styles.search}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <label htmlFor="media-search" className="sr-only">Search media</label>
          <input
            id="media-search"
            type="search"
            placeholder="Search media…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-controls="media-results"
          />
        </div>
      </div>

      <p className={query ? styles.resultSummary : "sr-only"} role="status" aria-live="polite" aria-atomic="true">
        {resultCount} {resultCount === 1 ? "result" : "results"}{query ? ` for “${search.trim()}”` : ""}
      </p>

      <div id="media-results">
        {visibleGroups.map(({ id, label, items }) => (
          <section key={id} id={id} aria-labelledby={`${id}-heading`} className={styles.section}>
            <div className={styles.sectionHeading}>
              <h2 id={`${id}-heading`}>{label}</h2>
              <span>{items.length} {items.length === 1 ? "item" : "items"}</span>
            </div>
            <ul className={styles.list}>
              {items.map((item) => <MediaRow key={item.id} item={item} />)}
            </ul>
          </section>
        ))}
        {!resultCount && (
          <div className={styles.empty}>
            <h2>No matching media</h2>
            <p>Try another name, publication or topic.</p>
            <button type="button" onClick={reset}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

const MediaRow = ({ item }: { item: MediaCard }) => {
  const category = getCategory(item);
  const host = getHost(item.url);
  const isYouTube = host === "youtube.com" || host === "youtu.be";
  const action = category === "news" ? "Read" : category === "podcast" ? "Listen" : isYouTube ? "Watch" : "Open";

  return (
    <li>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.row}>
        <div className={styles.thumbnail} aria-hidden="true">
          {item.image ? (
            <img
              src={item.image}
              alt=""
              loading="lazy"
              decoding="async"
              className={isYouTube ? styles.videoImage : styles.image}
            />
          ) : (
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="7" y="5" width="18" height="22" rx="1" />
              <path d="M11 11h10M11 16h10M11 21h6" />
            </svg>
          )}
        </div>
        <div className={styles.details}>
          <p className={styles.source}>{getSource(item)}</p>
          <h3>{item.title}</h3>
          {item.description && <p className={styles.description}>{item.description}</p>}
        </div>
        <span className={styles.action}>
          <span>{action}</span>
          <Arrow />
          <span className="sr-only"> (opens in a new tab)</span>
        </span>
      </a>
    </li>
  );
};
