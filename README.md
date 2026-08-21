# Persoal Portfolio

## Stack

- A modern React 19 and TypeScript frontend utilizing 3D graphics, powered by a headless Sanity.io CMS.

## Project structure

```text
.
├── public/                 Static assets and project previews
├── src/
│   ├── components/         Portfolio sections and interactive UI
│   ├── context/            Theme state
│   ├── data/               Portfolio content used by the frontend
│   ├── lib/                Sanity queries, client, and Cloudinary helpers
│   ├── types/              Sanity content types
│   └── utils/              Shared browser utilities
├── studio/                 Sanity Studio and content schemas
├── .env.example            Frontend environment variable template
└── vite.config.ts          Vite and Tailwind configuration
```

## Getting started

### Requirements

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
cd studio
npm install
cd ..
```

### Configure environment variables

Copy the frontend environment template:

```bash
copy .env.example .env
```

On macOS or Linux, use:

```bash
cp .env.example .env
```

Then fill in the values for Sanity and Cloudinary:

```env
VITE_SANITY_PROJECT_ID="your-sanity-project-id"
VITE_SANITY_DATASET="production"
VITE_SANITY_API_VERSION="2025-01-01"
VITE_SANITY_READ_TOKEN="your-read-only-sanity-token"
VITE_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
```

The template also keeps the existing application variables:

```env
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
```

For the Studio, copy [`studio/.env.example`](studio/.env.example) to
`studio/.env`:

```env
SANITY_STUDIO_PROJECT_ID="your-sanity-project-id"
SANITY_STUDIO_DATASET="production"
```

The Sanity project ID and dataset come from the Sanity project dashboard. The
Cloudinary cloud name comes from the Cloudinary dashboard. The API version is a
client-side choice and can remain `2025-01-01`.

Never expose a Sanity write token through a `VITE_*` variable. If an admin
panel is added later, keep its write token in a server-side environment
variable such as `SANITY_API_WRITE_TOKEN`.

## Local development

Start the frontend:

```bash
npm run dev
```

The Vite server runs at [http://localhost:3000](http://localhost:3000).

Start the Sanity Studio in a separate terminal:

```bash
npm run studio:dev
```

The Studio uses the schemas in `studio/schemas/`:

- `post` for published blog posts, Portable Text, code blocks, tags, and SEO metadata
- `project` for project descriptions, Cloudinary images, technology stacks, links, featured status, and manual ordering

Images are managed in Cloudinary. Store Cloudinary delivery URLs or public IDs
in Sanity documents and use the helpers in `src/lib/cloudinary.ts` for
optimized delivery URLs and responsive `srcSet` values.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Create a production frontend build |
| `npm run preview` | Preview the production frontend build locally |
| `npm run lint` | Run the TypeScript check |
| `npm run studio:dev` | Start Sanity Studio locally |
| `npm run clean` | Remove the frontend build output |

The Studio also has its own scripts:

```bash
cd studio
npm run dev
npm run build
npm run deploy
```

## Deployment

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set the project root to the repository root.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Add the required `VITE_*` environment variables in the Vercel project settings.
6. Deploy.

### Sanity Studio

The Studio lives in `/studio`, so it can be developed alongside the frontend.
It can be deployed through the Sanity CLI after authenticating with Sanity:

```bash
cd studio
npm run deploy
```

## Content fetching

Typed Sanity queries are available in [`src/lib/queries.ts`](src/lib/queries.ts):

- Published posts ordered by publication date
- A single published post by slug
- Projects ordered by the manual `order` field
- A single project by slug

The frontend client is configured in
[`src/lib/sanityClient.ts`](src/lib/sanityClient.ts), and the corresponding
TypeScript models are in [`src/types/content.ts`](src/types/content.ts).

## Safety notes

- Do not commit `.env` files or API tokens.
- Commit `.env.example` files with placeholder values only.
- Use a read-only Sanity token for browser reads when a public dataset is not suitable.
- Keep write tokens server-side and out of the Vite client bundle.
