const getIdFromLastQuery = (url: string) => `${url.split('=').reverse()[0]}`;

export const getNextLink = (url?: string): string | null =>
  url ? `/${getIdFromLastQuery(url)}` : null;

export const getPreviousLink = (url?: string): string | null => {
  if (!url) {
    return null;
  }

  const previousPageId = getIdFromLastQuery(url);

  return previousPageId === '1' ? '/' : `/${previousPageId}`;
};
