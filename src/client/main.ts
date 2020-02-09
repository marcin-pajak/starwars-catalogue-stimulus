import { Application } from 'stimulus';
import Turbolinks from 'turbolinks';

import './main.css';
import SearchController from './search';

Turbolinks.start();
const application = Application.start();
application.register('search', SearchController);
