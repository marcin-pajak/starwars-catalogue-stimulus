import nodeFetch from 'node-fetch';
import fetchCached from 'fetch-cached';
import NodeCache, { Key } from 'node-cache';

export const API_URL = 'https://swapi.co/api';

const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 });
export const apiCall = fetchCached({
  fetch: nodeFetch,
  cache: {
    get: (k: Key) => Promise.resolve(cache.get(k)),
    set: (k: Key, v: unknown) => Promise.resolve(cache.set(k, v)),
  },
});
