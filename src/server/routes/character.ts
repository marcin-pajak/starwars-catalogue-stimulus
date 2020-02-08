import express from 'express';
import { Response } from 'node-fetch';

import { apiCall, API_URL } from '../helpers/apiCall';

const router = express.Router();

router.get('/:id', async (req: express.Request, res: express.Response) => {
  const { id = 1 } = req.params;
  const person = await apiCall(
    `${API_URL}/people/${id}`
  ).then((response: Response) => response.json());
  const planet = await apiCall(person.homeworld).then((response: Response) =>
    response.json()
  );

  res.render('character', {
    person,
    planet,
    title: person.name,
  });
});

export default router;
