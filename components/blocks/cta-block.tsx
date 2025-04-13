// components/blocks/cta-block.tsx
import type { Template } from "tinacms";

// components/blocks/cta-block.tsx
import { Section } from "../utilities/section";
import { Container } from "../utilities/container";
import { tinaField } from "tinacms/dist/react";

interface CtaCardProps {
  tag: string;
  title: string;
  subtitle: string;
  backgroundImg?: string;
  link: {
    url: string;
    isEmail?: boolean;
  };
  theme: "yellow" | "gray";
}

const CtaCard = ({
                   tag,
                   title,
                   subtitle,
                   backgroundImg,
                   link,
                   theme
                 }: CtaCardProps) => {
  const href = link.isEmail ? `mailto:${link.url}` : link.url;
  const borderColor =
    theme === "yellow" ? "border-[#ffaf18]/30" : "border-white/20";
  const tagBgColor = theme === "yellow" ? "bg-[#ffaf18]/20" : "bg-[#fff3]";
  const bgColor = theme === "yellow" ? "bg-[#ffaf1808]" : "bg-white/5";
  const tagTextColor = theme === "yellow" ? "text-[#dad085]" : "text-white";
  return (
    <a
      href={href}
      target={link.isEmail ? undefined : "_blank"}
      rel={link.isEmail ? undefined : "noopener noreferrer"}
      className={`relative group block overflow-hidden  h-[214px] ${borderColor} ${bgColor} border-[1px]`}
    >
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={backgroundImg}
          alt=""
          className="absolute h-[325px] w-[289px] right-[-41px] opacity-40 bottom-[-141px] "
        />
        {/* 暗色渐变遮罩 */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 transition-opacity group-hover:opacity-75" />

        {/* 内容 */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <div>
            <span
              className={`inline-block px-2 py-1 text-xs uppercase ${tagBgColor} ${tagTextColor} `}
            >
              {tag}
            </span>
          </div>

          <div>
            <h3
              className={`text-[38px] font-bold mb-2  transition-colors ${tagTextColor}`}
            >
              {title}
            </h3>
            <p className="text-sm text-white opacity-50">{subtitle}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export const CtaBlock = ({ data }) => {
  return (
    <Section>
      <Container size="small">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Career CTA */}
          {data.careerCta && (
            <div data-tina-field={tinaField(data.careerCta)}>
              <CtaCard
                tag={data.careerCta.tag}
                title={data.careerCta.title}
                subtitle={data.careerCta.subtitle}
                backgroundImg={data.careerCta.backgroundImg}
                link={{ url: data.careerCta.linkUrl }}
                theme="yellow"
              />
            </div>
          )}

          {/* Contact CTA */}
          {data.contactCta && (
            <div data-tina-field={tinaField(data.contactCta)}>
              <CtaCard
                tag={data.contactCta.tag}
                title={data.contactCta.title}
                subtitle={data.contactCta.subtitle}
                backgroundImg={data.contactCta.backgroundImg}
                link={{ url: data.contactCta.email, isEmail: true }}
                theme="gray"
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

export const ctaBlockSchema: Template = {
  name: "cta_section",
  label: "CTA Section",
  ui: {
    previewSrc: "/blocks/cta-section.png"
  },
  fields: [
    {
      type: "object",
      label: "Career CTA",
      name: "careerCta",
      fields: [
        {
          type: "string",
          label: "Tag",
          name: "tag"
        },
        {
          type: "string",
          label: "Title",
          name: "title"
        },
        {
          type: "string",
          label: "Subtitle",
          name: "subtitle"
        },
        {
          type: "string",
          label: "Link URL",
          name: "linkUrl"
        },
        {
          type: "image",
          label: "Background Image",
          name: "backgroundImg"
        }
      ]
    },
    {
      type: "object",
      label: "Contact CTA",
      name: "contactCta",
      fields: [
        {
          type: "string",
          label: "Tag",
          name: "tag"
        },
        {
          type: "string",
          label: "Title",
          name: "title"
        },
        {
          type: "string",
          label: "Subtitle",
          name: "subtitle"
        },
        {
          type: "string",
          label: "Email",
          name: "email"
        },
        {
          type: "image",
          label: "Background Image",
          name: "backgroundImg"
        }
      ]
    }
  ]
};
