import type { PageBlocksFeatures } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Link from "next/link";
import { Children } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./features.module.css";
import { ProtocolExplorer } from "./protocol-explorer";

export const Features = ({ data }: { data: PageBlocksFeatures }) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.actions}>
          <Link href="/posts#research" className={styles.action}>
            Read Our Research →
          </Link>
          <a
            href="#protocols"
            className={styles.scrollIndicator}
            aria-label="Scroll down to explore our protocols"
            onClick={(event) => {
              const protocols = document.getElementById("protocols");
              if (!protocols) return;
              event.preventDefault();
              protocols.focus({ preventScroll: true });
              protocols.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "auto"
                  : "smooth",
                block: "start"
              });
            }}
          >
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" aria-hidden="true">
              <path d="M12 4v24m-8-8 8 8 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        <div id="protocols" className={styles.protocols} tabIndex={-1}>
          {data.introduction?.trim() && (
            <div className={styles.overview}>
              <h1 className={styles.overviewTitle}>Overview</h1>
              <div
                data-tina-field={tinaField(data, "introduction")}
                className={styles.introduction}
              >
                <ReactMarkdown
                  components={{
                    strong: ({ children }) => (
                      <strong>
                        {Children.map(children, (child) => typeof child === "string"
                          ? child.split(/(\[\[alloc\] init\])/g).map((part, index) =>
                              part === "[[alloc] init]"
                                ? <span key={index} className={styles.brand}>{part}</span>
                                : part
                            )
                          : child
                        )}
                      </strong>
                    )
                  }}
                >
                  {data.introduction}
                </ReactMarkdown>
              </div>
            </div>
          )}
          <ProtocolExplorer data={data} />
        </div>
      </div>
    </section>
  );
};
