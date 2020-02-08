import express from 'express';
import createError from 'http-errors';
import path from 'path';

import { ExpressError } from './types';
import * as routes from './routes';

const DEFAULT_PORT = 3000;

const app = express();
const port = process.env.PORT || DEFAULT_PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  (_: express.Request, res: express.Response, next: express.NextFunction) => {
    res.locals = {
      lang: 'en',
      title: 'StarWars Catalogue',
    };
    next();
  }
);

app.use('/', routes.characters);
app.use('/character', routes.character);

// Catch 404 and forward to error handler
app.use(
  (_: express.Request, res: express.Response, next: express.NextFunction) => {
    next(createError(404));
  }
);

// Error handler
app.use(
  (
    err: ExpressError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (res.headersSent) {
      return next(err);
    }

    // set locals, only providing error in development
    res.locals.message = err.message ?? 'Error';
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status ?? 500);
    res.render('error');
  }
);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
