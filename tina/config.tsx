import { defineConfig } from "tinacms";

import Post from "./collection/post";
import Global from "./collection/global";
import Author from "./collection/author";
import Page from "./collection/page";
import Research from "./collection/research";
import MediaCard from "./collection/media-card";

const isVercelPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
const branch = isVercelPreview
  ? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
  : process.env.NEXT_PUBLIC_TINA_BRANCH ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD;

if (isVercelPreview && !branch) {
  throw new Error(
    "Tina requires NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF in Vercel Preview. Enable system environment variables in your Vercel project settings."
  );
}

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch,
  token: process.env.TINA_TOKEN!,
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema: {
    collections: [Post, Global, Author, Page, Research, MediaCard],
  },
});

export default config;
