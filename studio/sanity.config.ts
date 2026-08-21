import { codeInput } from '@sanity/code-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

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

