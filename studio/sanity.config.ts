import { codeInput } from '@sanity/code-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

if (!projectId || !dataset || projectId === 'your-project-id') {
  throw new Error(
    'Sanity Studio is not configured. Create studio/.env from studio/.env.example and add your real project ID and dataset.',
  );
}

export default defineConfig({
  name: 'portfolio-studio',
  title: 'Portfolio Studio',
  projectId,
  dataset,
  plugins: [visionTool(), codeInput()],
  schema: {
    types: schemaTypes,
  },
});
