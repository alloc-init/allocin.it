import { useId, useRef, useState } from "react";
import type { PageBlocksFeatures, PageBlocksFeaturesItems } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import styles from "./protocol-explorer.module.css";

const Arrow = ({ previous = false }: { previous?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={previous ? "M20 12H4m7-7-7 7 7 7" : "M4 12h16m-7-7 7 7-7 7"}
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

export const ProtocolExplorer = ({ data }: { data: PageBlocksFeatures }) => {
  const items = (data.items || []).filter((item): item is PageBlocksFeaturesItems => Boolean(item));
  const [selected, setSelected] = useState(-1);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const activeIndex = selected < items.length ? selected : -1;
  const active = items[activeIndex];

  const selectConcept = (index: number) => {
    setSelected(index);
    if (window.matchMedia("(max-width: 899px)").matches) {
      window.requestAnimationFrame(() => panelRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      }));
    }
  };

  if (!items.length) return null;

  return (
    <div className={styles.explorer}>
      <div className={styles.diagram}>
        <div className={styles.diagramHeader}>
          <span className={styles.eyebrow}>Explore the concepts</span>
          <button type="button" className={styles.overviewButton}
            aria-pressed={!active} aria-controls={panelId} onClick={() => selectConcept(-1)}>
            Overview
          </button>
        </div>
        <ol className={styles.nodes} aria-label="How our concepts connect">
          {items.map((item, index) => (
            <li key={index}>
              <button type="button" className={styles.nodeButton}
                aria-pressed={activeIndex === index} aria-controls={panelId}
                onClick={() => selectConcept(index)}>
                <span className={styles.nodeNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.nodeCopy}>
                  <span className={styles.nodeTitle} data-tina-field={tinaField(item, "title")}>{item.title}</span>
                  {item.role && <span className={styles.nodeRole} data-tina-field={tinaField(item, "role")}>{item.role}</span>}
                </span>
                <span className={styles.nodeArrow} aria-hidden="true">→</span>
              </button>
              {index < items.length - 1 && (
                <div className={styles.connector}>
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
                    <path d="M6 0v18m-4-4 4 4 4-4" stroke="currentColor" />
                  </svg>
                  <span data-tina-field={tinaField(item, "connection")}>{item.connection}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className={styles.foundation}>
          <span><strong>Bitcoin L1</strong> provides publication, ordering, and settlement.</span>
        </div>
      </div>
      <div className={styles.panel}>
        <div ref={panelRef} id={panelId} role="region" aria-label="Selected concept" aria-live="polite" aria-atomic="true" className={styles.panelContent}>
          {[null, ...items].map((item, index) => {
            const paperUrl = item?.paperUrl?.trim();
            const companionBlogUrl = item?.companionBlogUrl?.trim();

            return (
              <div key={index} className={styles.conceptPanel} aria-hidden={activeIndex !== index - 1}>
                <p className={styles.eyebrow}>{item ? item.role || "Concept" : "One shared foundation"}</p>
                <h2 className={styles.panelTitle} data-tina-field={item ? tinaField(item, "title") : undefined}>
                  {item?.title || "How it fits together"}
                </h2>
                {item?.text?.children?.length > 0 ? (
                  <div className={`${styles.detailsBody} prose dark:prose-dark max-w-none`}
                    data-tina-field={tinaField(item, "text")}>
                    <TinaMarkdown content={item.text} />
                  </div>
                ) : (
                  <p className={styles.summary}
                    data-tina-field={item ? tinaField(item, "summary") : tinaField(data, "diagramSummary")}>
                    {item ? item.summary : data.diagramSummary}
                  </p>
                )}
                {item && (
                  <div className={styles.paper}>
                    {paperUrl ? (
                      <>Read the <a className={styles.paperLink} href={paperUrl}
                        data-tina-field={tinaField(item, "paperUrl")}>whitepaper</a></>
                    ) : (
                      <span className={styles.paperPlaceholder}
                        data-tina-field={tinaField(item, "paperUrl")}>Whitepaper — coming soon</span>
                    )}
                    {companionBlogUrl && (
                      <>{paperUrl ? " and its " : ". Read the "}<a className={styles.paperLink} href={companionBlogUrl}
                        data-tina-field={tinaField(item, "companionBlogUrl")}>companion blog</a></>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.controls}>
          <button type="button" className={styles.arrowButton} aria-label="Previous concept"
            aria-controls={panelId} disabled={activeIndex === -1} onClick={() => setSelected(activeIndex - 1)}>
            <Arrow previous />
          </button>
          <button type="button" className={styles.arrowButton} aria-label="Next concept"
            aria-controls={panelId} disabled={activeIndex === items.length - 1} onClick={() => setSelected(activeIndex + 1)}>
            <Arrow />
          </button>
          <span className={styles.counter}>{active ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}` : "Overview"}</span>
        </div>
      </div>
    </div>
  );
};
