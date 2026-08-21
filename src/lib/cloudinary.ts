const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const defaultWidths = [480, 768, 1024, 1440, 1920];

export type CloudinaryImageOptions = {
  width?: number;
  height?: number;
  crop?: 'limit' | 'fill' | 'fit' | 'scale' | 'thumb';
  gravity?: string;
};

function transformations(options: CloudinaryImageOptions = {}) {
  const parts = ['f_auto', 'q_auto'];

  if (options.width) parts.push(`w_${Math.round(options.width)}`);
  if (options.height) parts.push(`h_${Math.round(options.height)}`);
  if (options.crop) parts.push(`c_${options.crop}`);
  if (options.gravity) parts.push(`g_${options.gravity}`);

  return parts.join(',');
}

export function cloudinaryUrl(
  source: string,
  options: CloudinaryImageOptions = {},
): string {
  if (!source) return '';

  const transform = transformations(options);

  if (/^https?:\/\//i.test(source)) {
    if (!source.includes('res.cloudinary.com') || !/\/image\/upload\//.test(source)) {
      return source;
    }

    return source.replace('/image/upload/', `/image/upload/${transform}/`);
  }

  if (!cloudName) {
    console.warn('Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME to .env.');
    return source;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${source}`;
}

export function cloudinarySrcSet(
  source: string,
  widths: number[] = defaultWidths,
): string {
  return widths
    .map((width) => `${cloudinaryUrl(source, { width, crop: 'limit' })} ${width}w`)
    .join(', ');
}
