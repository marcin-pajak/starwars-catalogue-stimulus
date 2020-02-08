import express from 'express';
import { Response } from 'node-fetch';

import { apiCall, API_URL } from '../helpers/apiCall';
import { getIdFromUrl } from '../helpers/getIdFromUrl';

const router = express.Router();

router.get('/search', async (req: express.Request, res: express.Response) => {
  const { character = '' } = req.query;
  const data = await apiCall(
    `${API_URL}/people/?search=${character}`
  ).then((response: Response) => response.json());

  res.render('index', {
    data,
    getIdFromUrl,
    search: character,
    showBack: true,
    title: 'Search | StarWars Catalogue',
  });
});

router.get('/', async (_: express.Request, res: express.Response) => {
  const data = await apiCall(
    `${API_URL}/people/?page=1`
  ).then((response: Response) => response.json());

  res.render('index', {
    data,
    getIdFromUrl,
    search: '',
    showBack: false,
  });
});

export default router;
