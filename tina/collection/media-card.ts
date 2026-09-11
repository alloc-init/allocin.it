import type { Collection } from "tinacms";

const MediaCard: Collection = {
  label: "Media Cards",
  name: "mediaCard",
  path: "content/media",
  format: "json",
  defaultItem: {
    order: 100,
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      type: "image",
      name: "image",
      label: "Cover Image",
      required: true,
    },
    {
      type: "string",
      name: "url",
      label: "Link",
      description: "The full https:// or http:// link to the podcast or talk.",
      required: true,
      ui: {
        validate: (value) => {
          try {
            const url = new URL(value);
            if (url.protocol === "https:" || url.protocol === "http:") {
              return;
            }
          } catch {
            // Invalid URLs use the same message as unsupported protocols.
          }
          return "Enter a complete https:// or http:// link.";
        },
      },
    },
    {
      type: "number",
      name: "order",
      label: "Display Order",
      description: "Lower numbers appear first in Resources.",
      required: true,
    },
  ],
};

export default MediaCard;
