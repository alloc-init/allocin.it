import { iconSchema } from "../fields/icon";

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
          label: "Companion Blog URL",
          name: "companionBlogUrl",
          description: "Link to the companion blog post on this site or on Notion. Leave empty to hide the blog link."
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
