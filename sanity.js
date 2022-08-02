import {
  createClient,
  createPortableTextComponent,
  createPreviewSubscriptionHook
} from "next-sanity";

import createImageUrlBuilder from '@sanity/image-url'

export const config = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: "2021-08-11", // or today's date for latest
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
  useCdn: process.env.NODE_ENV === "production",
};

// Client for fetching data in the getProps page func
export const sanityClient = createClient(config);

// Helper func for gen image urls
export const urlFor = (source) => createImageUrlBuilder(config).image(source);