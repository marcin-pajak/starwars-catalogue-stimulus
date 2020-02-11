import 'isomorphic-fetch';
import 'mutationobserver-shim';
import SpeechRecognition from 'speech-recognition-mock';

// @ts-ignore
global.SpeechRecognition = SpeechRecognition;

Object.defineProperty(navigator, 'connection', {
  get: () => undefined,
  configurable: true,
});
