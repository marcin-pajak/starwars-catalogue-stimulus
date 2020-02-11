import { Application } from 'stimulus';

import { mockFetch } from '../../test/mockFetch';
import LoadController from './contentLoader';

const getTemplate = (url: string): string => `
  <div 
    id="element"
    data-controller="load" 
    data-load-save-bandwidth="true"
    data-load-url="${url}"
  />
`;

let application: Application;

describe('SearchController', () => {
  describe('on fast Internet connection', () => {
    beforeEach(() => {
      // @ts-ignore
      jest.spyOn(navigator, 'connection', 'get').mockReturnValue({
        effectiveType: '4g',
      });
      document.body.innerHTML = getTemplate('/some');
      window.fetch = mockFetch('<div>template</div>');

      application = Application.start();
      application.register('load', LoadController);
    });

    it('should fetch content', async () => {
      const loadController = application.controllers[0] as LoadController;
      const element = document.getElementById('element') as HTMLDivElement;
      jest.spyOn(loadController, 'load');
      jest.spyOn(window, 'fetch');

      await loadController.connect();

      expect(element.textContent).toBe('template');
      expect(loadController.load).toHaveBeenCalledTimes(1);
      expect(window.fetch).toHaveBeenCalledTimes(1);
      expect(element.dataset['loadIsDone']).toBe('true');
      jest.resetAllMocks();

      await loadController.connect();

      expect(element.textContent).toBe('template');
      expect(loadController.load).not.toHaveBeenCalled();
    });
  });

  describe('on slow Internet connection', () => {
    beforeEach(() => {
      // @ts-ignore
      jest.spyOn(navigator, 'connection', 'get').mockReturnValue({
        effectiveType: '2g',
      });
      document.body.innerHTML = getTemplate('/some');
      window.fetch = mockFetch('<div>template</div>');

      application = Application.start();
      application.register('load', LoadController);
    });

    it('should not fetch content on slow Internet connection', () => {
      const loadController = application.controllers[0] as LoadController;
      jest.spyOn(loadController, 'load');
      jest.spyOn(window, 'fetch');

      loadController.connect();

      expect(loadController.load).not.toHaveBeenCalled();
      expect(window.fetch).not.toHaveBeenCalled();
    });
  });

  describe('without NetworkInformation support', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      window.fetch = mockFetch('');
      document.body.innerHTML = getTemplate('');

      application = Application.start();
    });

    it('should not fetch content without url', () => {
      application.register('load', LoadController);

      const loadController = application.controllers[0] as LoadController;
      jest.spyOn(loadController, 'load');
      jest.spyOn(window, 'fetch');

      loadController.connect();

      expect(loadController.load).toHaveBeenCalled();
      expect(window.fetch).not.toHaveBeenCalled();
    });
  });
});
