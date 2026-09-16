import { Icon } from "../utilities/icon";
import { iconSchema } from "../utilities/icon";
import type {
  PageBlocksFeatures,
  PageBlocksFeaturesItems
} from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Link from "next/link";
import { Children } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./features.module.css";

const sectionIds = (items: PageBlocksFeaturesItems[]) => {
  const slugs = items.map((item) =>
    (item.title || "section")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "") || "section"
  );
  const used = new Set<string>();

  return slugs.map((slug, index) => {
    const duplicate = slugs.indexOf(slug) !== slugs.lastIndexOf(slug);
    let id = duplicate ? `${slug}-${index + 1}` : slug;
    let suffix = 1;

    while (used.has(id)) {
      id = `${slug}-${index + 1}-${suffix++}`;
    }

    used.add(id);
    return id;
  });
};

export const Feature = ({
  featuresColor,
  data,
  id
}: {
  featuresColor: string;
  data: PageBlocksFeaturesItems;
  id: string;
}) => {
  return (
    <article
      id={id}
      aria-labelledby={data.title ? `${id}-title` : undefined}
      data-tina-field={tinaField(data)}
      className={styles.feature}
    >
      <div className={styles.heading}>
        {data.icon?.name?.trim() && (
          <Icon
            tinaField={tinaField(data, "icon")}
            parentColor={featuresColor}
            data={{ size: "large", ...data.icon }}
            className={styles.icon}
          />
        )}
        {data.title && (
          <h2
            id={`${id}-title`}
            data-tina-field={tinaField(data, "title")}
            className={`${styles.title} text-sm opacity-50 title-font`}
          >
            {data.title}
          </h2>
        )}
      </div>
      {data.text && (
        <div
          data-tina-field={tinaField(data, "text")}
          className={`${styles.body} ${data.title === "Bitcoin PIPEs" || data.title === "Programmable Vaults" ? styles.highlightLead : ""} text-base opacity-80 leading-relaxed prose dark:prose-dark max-w-none`}
        >
          <TinaMarkdown content={data.text} />
        </div>
      )}
    </article>
  );
};

export const Features = ({ data }: { data: PageBlocksFeatures }) => {
  const items = (data.items || []).filter(Boolean);
  const ids = sectionIds(items);

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
          <div className={styles.protocolList}>
            {items.map((item, index) => (
              <Feature
                key={ids[index]}
                id={ids[index]}
                featuresColor={data.color}
                data={item}
              />
            ))}
          </div>
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
      description: "Optional text above the three columns. Leave empty to hide it.",
      ui: {
        component: "textarea"
      }
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
