import { defineArrayMember, defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'manualOverrideKey',
      title: 'Manual project override key',
      type: 'string',
      description: 'Optional manual project id to replace, such as claw-agent.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      initialValue: 'CURRENT',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'ACTIVE' },
          { title: 'Archived', value: 'ARCHIVED' },
          { title: 'Transmitting', value: 'TRANSMITTING' },
        ],
        layout: 'radio',
      },
      initialValue: 'ACTIVE',
    }),
    defineField({
      name: 'primaryDomain',
      title: 'Primary domain',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image URL',
      type: 'string',
      description: 'Cloudinary delivery URL or public ID.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery image URLs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'originStory',
      title: 'Origin story',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'architectureOverview',
      title: 'Architecture overview',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'buildPhases',
      title: 'Build phases',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'phaseNumber', title: 'Phase number', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'topologyFlow',
      title: 'Topology flow',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'stepNumber', title: 'Step number', type: 'string' }),
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'designDecisions',
      title: 'Design decisions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4 }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'specSnippet',
      title: 'Specification snippet',
      type: 'object',
      fields: [
        defineField({ name: 'tabTitle', title: 'Tab title', type: 'string' }),
        defineField({ name: 'fileName', title: 'File name', type: 'string' }),
        defineField({ name: 'language', title: 'Language', type: 'string', initialValue: 'text' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        defineField({ name: 'codeSnippet', title: 'Code', type: 'text', rows: 12 }),
      ],
    }),
    defineField({
      name: 'keyInnovations',
      title: 'Key innovations',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
            defineField({ name: 'context', title: 'Context', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'toonNotes',
      title: 'Additional notes',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'techStack',
      title: 'Tech stack',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().integer(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});
