import type { Collection } from "tinacms";
import { getExternalUrl } from "../../components/utilities/external-url";

const Post: Collection = {
  label: "Blog Posts",
  name: "post",
  path: "content/posts",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      label: "Subtitle",
      name: "subtitle",
    },
    {
      type: "string",
      label: "Notion / External URL",
      name: "externalUrl",
      description:
        "Optional. Paste a public Notion page or another website URL. The Writings card opens it in a new tab. Leave empty for an article on this site.",
      ui: {
        validate: (value) => {
          if (value?.trim() && !getExternalUrl(value)) {
            return "Enter a complete https:// or http:// URL.";
          }
        },
      },
    },
    {
      type: "string",
      label: "Type",
      name: "type",
    },
    {
      type: "image",
      name: "heroImg",
      label: "Hero Image",
    },
    {
      type: "rich-text",
      label: "Excerpt",
      name: "excerpt",
    },
    {
      type: "reference",
      label: "Author",
      name: "author",
      collections: ["author"],
    },
    {
      type: "datetime",
      label: "Posted Date",
      name: "date",
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A",
      },
    },
    {
      type: "string",
      label: "Body",
      name: "_body",
      description:
        "Article text for this site. Can be left empty when Notion / External URL is set.",
      isBody: true,
      ui: {
        component: "textarea",
      },
    },
  ],
};

export default Post;
