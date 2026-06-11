const DEFAULT_IMAGE = '/pg10.png';

export function createPageMetadata({ title, description, path }) {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | Tasteorama`,
      description,
      url: path,
      type: 'website',
      images: [DEFAULT_IMAGE],
    },
  };
}
