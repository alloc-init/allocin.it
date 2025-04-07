// components/blocks/cta-block.tsx
import type { Template } from "tinacms";

// components/blocks/cta-block.tsx
import { Section } from "../util/section";
import { Container } from "../util/container";
import { tinaField } from "tinacms/dist/react";
import Link from "next/link";

interface CtaCardProps {
  tag: string;
  title: string;
  subtitle: string;
  backgroundImg?: string;
  link: {
    url: string;
    isEmail?: boolean;
  };
}

const CtaCard = ({
  tag,
  title,
  subtitle,
  backgroundImg,
  link,
}: CtaCardProps) => {
  const href = link.isEmail ? `mailto:${link.url}` : link.url;

  return (
    <a
      href={href}
      target={link.isEmail ? undefined : "_blank"}
      rel={link.isEmail ? undefined : "noopener noreferrer"}
      className="relative group block overflow-hidden rounded-lg"
    >
      <div
        className="relative aspect-[16/9] overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 暗色渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 transition-opacity group-hover:opacity-75" />

        {/* 内容 */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
          <div>
            <span className="inline-block px-4 py-1 text-sm font-medium bg-orange-500 rounded">
              {tag}
            </span>
          </div>

          <div>
            <h3 className="text-3xl font-bold mb-2 group-hover:text-orange-500 transition-colors">
              {title}
            </h3>
            <p className="text-lg text-gray-300">{subtitle}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export const CtaBlock = ({ data }) => {
  return (
    <Section>
      <Container size="large">
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
    previewSrc: "/blocks/cta-section.png",
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
          name: "tag",
        },
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "string",
          label: "Subtitle",
          name: "subtitle",
        },
        {
          type: "string",
          label: "Link URL",
          name: "linkUrl",
        },
        {
          type: "image",
          label: "Background Image",
          name: "backgroundImg",
        },
      ],
    },
    {
      type: "object",
      label: "Contact CTA",
      name: "contactCta",
      fields: [
        {
          type: "string",
          label: "Tag",
          name: "tag",
        },
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "string",
          label: "Subtitle",
          name: "subtitle",
        },
        {
          type: "string",
          label: "Email",
          name: "email",
        },
        {
          type: "image",
          label: "Background Image",
          name: "backgroundImg",
        },
      ],
    },
  ],
};
