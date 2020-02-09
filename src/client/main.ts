import { Application } from 'stimulus';
import Turbolinks from 'turbolinks';

import './main.css';
import LoadController from './contentLoader';
import SearchController from './search';

Turbolinks.start();
const application = Application.start();
application.register('load', LoadController);
application.register('search', SearchController);
