import express from 'express';
import { Response } from 'node-fetch';

import { apiCall, API_URL } from '../helpers/apiCall';

const router = express.Router();

router.get('/', async (_: express.Request, res: express.Response) => {
  const data = await apiCall(
    `${API_URL}/people/?page=1`
  ).then((response: Response) => response.json());

  res.render('index', {
    data,
  });
});

export default router;
