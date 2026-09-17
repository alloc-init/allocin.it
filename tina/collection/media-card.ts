import type { Collection } from "tinacms";

const MediaCard: Collection = {
  label: "Content",
  name: "mediaCard",
  path: "content/media",
  format: "json",
  defaultItem: {
    category: "media",
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
      type: "string",
      name: "category",
      label: "Category",
      description: "Choose the section on the Content page. Older entries without a category appear in Media.",
      options: [
        { label: "Media", value: "media" },
        { label: "Podcast", value: "podcast" },
        { label: "News", value: "news" },
      ],
    },
    {
      type: "image",
      name: "image",
      label: "Cover Image",
      description: "Optional. Select or upload a cover in the media library.",
    },
    {
      type: "string",
      name: "publisher",
      label: "Publisher",
      description: "For example: Blockworks, Blockspace or a YouTube channel.",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "url",
      label: "Link",
      description: "The full https:// or http:// link to the video, podcast or news item.",
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
      description: "Lower numbers appear first within the selected category.",
      required: true,
    },
  ],
};

export default MediaCard;
