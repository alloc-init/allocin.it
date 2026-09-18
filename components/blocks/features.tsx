import { iconSchema } from "../utilities/icon";
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
          <Link href="/research" className={styles.action}>
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

const defaultFeature = {
  title: "Here's Another Feature",
  text: "This is where you might talk about the feature, if this wasn't just filler text.",
  icon: {
    color: "",
    style: "float",
    name: ""
  }
};

export const featureBlockSchema = {
  name: "features",
  label: "Features",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      items: [defaultFeature, defaultFeature, defaultFeature]
    }
  },
  fields: [
    {
      type: "string",
      label: "Introduction",
      name: "introduction",
      description: "Optional text above the concepts. Leave empty to hide it.",
      ui: {
        component: "textarea"
      }
    },
    {
      type: "string",
      label: "Diagram overview",
      name: "diagramSummary",
      description: "Explain how the concepts connect in the interactive diagram.",
      ui: { component: "textarea" }
    },
    {
      type: "object",
      label: "Feature Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title
          };
        },
        defaultItem: {
          ...defaultFeature
        }
      },
      fields: [
        iconSchema,
        {
          type: "string",
          label: "Title",
          name: "title"
        },
        {
          type: "string",
          label: "Role",
          name: "role",
          description: "Short label shown in the diagram, e.g. Cryptographic primitive."
        },
        {
          type: "string",
          label: "Short description",
          name: "summary",
          description: "Fallback description, shown if the full Text field is empty.",
          ui: { component: "textarea" }
        },
        {
          type: "string",
          label: "Whitepaper URL",
          name: "paperUrl",
          description: "Link below the concept text. Leave empty to show Whitepaper — coming soon."
        },
        {
          type: "string",
          label: "Connection to the next concept",
          name: "connection",
          description: "Label for the arrow to the next item. Not shown for the last item."
        },
        {
          type: "rich-text",
          label: "Text",
          name: "text"
        }
      ]
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" }
      ]
    }
  ]
};
