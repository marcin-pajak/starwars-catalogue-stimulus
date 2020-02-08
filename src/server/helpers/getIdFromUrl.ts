export const getIdFromUrl = (url: string): string =>
  `${url.split('/').reverse()[1]}`;
