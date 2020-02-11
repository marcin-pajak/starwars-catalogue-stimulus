import { Application } from 'stimulus';
import { SpeechRecognitionMock } from 'speech-recognition-mock';

import SearchController, {
  ACTIVE_CLASS,
  SUPPORTED_CLASS,
  VOICE,
  VOICE_ACTIVE,
} from './search';

const TEMPLATE = `
  <section data-controller="search">
    <form
      id="formTarget"
      data-target="search.form"
      method="GET"
    >
      <input
        id="inputTarget"
        data-target="search.input"
        name="character"
        required
        type="text"
        value=""
      />
      <button
        id="voiceButtonTarget"
        data-action="search#toggleVoice"
        data-target="search.voiceButton"
        type="button"
      >
        <span class="Search-icon Icon" data-target="search.voiceIcon"></span>
      </button>
      <button>Submit</button>
    </form>
  </section>
`;

let application: Application;

describe('SearchController', () => {
  describe('with SpeechRecognition support', () => {
    beforeEach(() => {
      window.SpeechRecognition = SpeechRecognitionMock;
      document.body.innerHTML = TEMPLATE;

      application = Application.start();
      application.register('search', SearchController);
    });

    it('should properly initialize', () => {
      const searchController = application.controllers[0] as SearchController;
      const voiceButtonTarget = document.getElementById(
        'voiceButtonTarget'
      ) as HTMLButtonElement;

      expect(voiceButtonTarget.title).toBe(VOICE.DESC);
      expect(voiceButtonTarget.classList.contains(SUPPORTED_CLASS)).toBe(true);
      expect(searchController['recognition']).not.toBeNull();
    });

    it('should properly handle toggling voice recognition', () => {
      const searchController = application.controllers[0] as SearchController;
      const voiceButtonTarget = document.getElementById(
        'voiceButtonTarget'
      ) as HTMLButtonElement;

      jest.spyOn(searchController['recognition'], 'start');
      jest.spyOn(searchController['recognition'], 'stop');

      voiceButtonTarget.click();

      expect(voiceButtonTarget.title).toBe(VOICE_ACTIVE.DESC);
      expect(voiceButtonTarget.classList.contains(ACTIVE_CLASS)).toBe(true);
      expect(searchController['recognition'].start).toHaveBeenCalledTimes(1);

      voiceButtonTarget.click();

      expect(voiceButtonTarget.title).toBe(VOICE.DESC);
      expect(voiceButtonTarget.classList.contains(ACTIVE_CLASS)).not.toBe(true);
      expect(searchController['recognition'].stop).toHaveBeenCalledTimes(1);
    });

    it('should properly handle recognized phrase', () => {
      const searchController = application.controllers[0] as any;
      const voiceButtonTarget = document.getElementById(
        'voiceButtonTarget'
      ) as HTMLButtonElement;
      const formTarget = document.getElementById(
        'formTarget'
      ) as HTMLFormElement;
      const inputTarget = document.getElementById(
        'inputTarget'
      ) as HTMLInputElement;
      jest.spyOn(formTarget, 'submit').mockImplementation();

      voiceButtonTarget.click();
      searchController.recognition.say('Luke', true, 0);

      expect(inputTarget.value).toBe('Luke');
      expect(formTarget.submit).toHaveBeenCalledTimes(1);
    });
  });

  describe('without SpeechRecognition support', () => {
    beforeEach(() => {
      window.SpeechRecognition = null;
      document.body.innerHTML = TEMPLATE;

      const application = Application.start();
      application.register('search', SearchController);
    });

    it('should properly initialize', () => {
      const searchController = application.controllers[0] as SearchController;
      const voiceButtonTarget = document.getElementById(
        'voiceButtonTarget'
      ) as HTMLButtonElement;

      voiceButtonTarget.click();

      expect(voiceButtonTarget.title).not.toBe(VOICE_ACTIVE.DESC);
      expect(voiceButtonTarget.classList.contains(SUPPORTED_CLASS)).toBe(false);
      expect(searchController['recognition']).toBeNull();
    });

    it('should not fail on toggling recognition', () => {
      const searchController = application.controllers[0] as SearchController;
      const voiceButtonTarget = document.getElementById(
        'voiceButtonTarget'
      ) as HTMLButtonElement;

      voiceButtonTarget.click();

      expect(searchController.isRecording).toBe(false);
    });
  });
});
