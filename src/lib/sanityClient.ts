import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION;
const readToken = import.meta.env.VITE_SANITY_READ_TOKEN;

if (!projectId || !dataset) {
  console.warn(
    'Sanity is not configured. Add VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET to .env.',
  );
}

/**
 * The token, when supplied, must be read-only. Any token embedded in a Vite
 * build is visible to browsers, so never put a write token in VITE_* env vars.
 */
export const sanityClient = createClient({
  projectId: projectId || 'your-project-id',
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2025-01-01',
  useCdn: !readToken,
  perspective: 'published',
  token: readToken || undefined,
});

