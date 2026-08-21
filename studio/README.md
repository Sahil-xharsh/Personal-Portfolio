# Portfolio Sanity Studio

Copy `.env.example` to `studio/.env` and set `SANITY_STUDIO_PROJECT_ID` and
`SANITY_STUDIO_DATASET` from your Sanity project dashboard.

From the repository root, run:

```bash
npm run studio:dev
```

The Studio uses Cloudinary URL fields, so upload images in Cloudinary and paste
their public delivery URLs (or public IDs) into documents.

