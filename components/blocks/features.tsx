import { Icon } from "../utilities/icon";
import { iconSchema } from "../utilities/icon";
import type {
  PageBlocksFeatures,
  PageBlocksFeaturesItems
} from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Link from "next/link";
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
  id,
  index
}: {
  featuresColor: string;
  data: PageBlocksFeaturesItems;
  id: string;
  index: number;
}) => {
  return (
    <article
      id={id}
      aria-labelledby={data.title ? `${id}-title` : undefined}
      data-tina-field={tinaField(data)}
      className={styles.feature}
    >
      <div className={styles.heading}>
        <div className={styles.sectionMarker} aria-hidden="true">
          <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.markerLine} />
        </div>
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
          className={`${styles.body} text-base opacity-80 leading-relaxed prose dark:prose-dark max-w-none`}
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
    <Section color={data.color}>
      <Container className={`flex text-white`} size="large">
        <div className="flex flex-col">
          {data.introduction?.trim() && (
            <p
              data-tina-field={tinaField(data, "introduction")}
              className="mb-8 max-w-3xl whitespace-pre-line text-base leading-relaxed opacity-80"
            >
              {data.introduction}
            </p>
          )}
          <div className="flex md:items-center flex-col md:flex-row gap-4 justify-between mb-8">
            {/*<h2 className="text-3xl  title-font">Simulation Will Be Orange</h2>*/}
            <Link
              href="/research"
              className="p-4 bg-[rgb(57,46,30)] text-[#dad085] w-[200px]"
            >
              Read Our Research →
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-8 text-left">
            {data.items &&
              data.items.map(function(block, i) {
                return (
                  <Feature featuresColor={data.color} key={i} data={block} />
                );
              })}
          </div>
        </div>
        <div id="protocols" className={styles.protocols}>
        {data.introduction?.trim() && (
          <div className={styles.overview}>
            <h1 className={styles.overviewTitle}>Overview</h1>
            <div
              data-tina-field={tinaField(data, "introduction")}
              className={styles.introduction}
            >
              {data.introduction.trim().split(/\n\s*\n/).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>
                  {paragraph.split(/(\[\[alloc\] init\])/g).map((part, index) =>
                    part === "[[alloc] init]" ? (
                      <strong key={index} className={styles.brand}>{part}</strong>
                    ) : part
                  )}
                </p>
              ))}
            </div>
          </div>
        )}
        {items.length > 0 && (
          <nav className={styles.navigation} aria-label="Explore our work">
            {items.map((item, index) => (
              <a key={ids[index]} href={`#${ids[index]}`} className={styles.jumpLink}>
                <span className={styles.jumpNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span data-tina-field={tinaField(item, "title")}>
                  {item.title || `Section ${index + 1}`}
                </span>
                <span className={styles.jumpArrow} aria-hidden="true">↓</span>
              </a>
            ))}
          </nav>
        )}
        {items.map((item, index) => (
          <Feature
            key={ids[index]}
            id={ids[index]}
            index={index}
            featuresColor={data.color}
            data={item}
          />
        ))}
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
