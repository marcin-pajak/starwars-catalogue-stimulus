import express from 'express';
import { Response } from 'node-fetch';

import { apiCall, API_URL } from '../helpers/apiCall';
import { getIdFromUrl } from '../helpers/getIdFromUrl';
import { getNextLink, getPreviousLink } from '../helpers/pagination';

const router = express.Router();

router.get('/search', async (req: express.Request, res: express.Response) => {
  const { character = '' } = req.query;
  const data = await apiCall(
    `${API_URL}/people/?search=${character}`
  ).then((response: Response) => response.json());

  res.render('index', {
    data,
    getIdFromUrl,
    nextLink: null,
    previousLink: null,
    search: character,
    showBack: true,
    title: 'Search | StarWars Catalogue',
  });
});

router.get(
  '/:pageNumber?',
  async (req: express.Request, res: express.Response) => {
    const { pageNumber = 1 } = req.params;
    const data = await apiCall(
      `${API_URL}/people/?page=${pageNumber}`
    ).then((response: Response) => response.json());

    res.render('index', {
      data,
      getIdFromUrl,
      nextLink: getNextLink(data.next),
      previousLink: getPreviousLink(data.previous),
      search: '',
      showBack: false,
    });
  }
);

export default router;
