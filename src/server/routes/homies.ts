import express from 'express';
import { Response } from 'node-fetch';

import { apiCall, API_URL } from '../helpers/apiCall';
import { getIdFromUrl } from '../helpers/getIdFromUrl';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  const { characterId = '', planetId = '' } = req.query;
  const planet = await apiCall(
    `${API_URL}/planets/${planetId}`
  ).then((response: Response) => response.json());
  const residentRequests = planet.residents
    .filter((residentUrl: string) => getIdFromUrl(residentUrl) !== characterId)
    .map(
      async (residentUrl: string) =>
        await apiCall(residentUrl).then((response: Response) => response.json())
    );
  const residents = await Promise.all(residentRequests);

  res.render('homies', {
    data: residents,
    getIdFromUrl
  });
});

export default router;
