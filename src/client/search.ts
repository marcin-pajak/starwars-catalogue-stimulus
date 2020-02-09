import { Controller, Context } from 'stimulus';

import { makeSpeechRecognizer } from './helpers/makeSpeechRecognizer';

export const ACTIVE_CLASS = 'is-active';
export const SUPPORTED_CLASS = 'is-supported';
export const VOICE = {
  ICON_CLASS: 'Icon--mic',
  DESC: 'Click to start voice recognition',
};
export const VOICE_ACTIVE = {
  ICON_CLASS: 'Icon--recording',
  DESC: 'Click to stop voice recognition',
};

export default class extends Controller {
  static targets = ['form', 'input', 'voiceButton', 'voiceIcon'];

  private recognition: SpeechRecognition | null;
  private _isRecording: boolean;
  // @ts-ignore
  private readonly formTarget: HTMLFormElement;
  // @ts-ignore
  private readonly inputTarget: HTMLInputElement;
  // @ts-ignore
  private readonly voiceButtonTarget: HTMLButtonElement;
  // @ts-ignore
  private readonly voiceIconTarget: HTMLSpanElement;

  get isRecording(): boolean {
    return this._isRecording;
  }

  set isRecording(value: boolean) {
    this._isRecording = value;
    if (value) {
      this.inputTarget.value = '';
      this.voiceButtonTarget.title = VOICE_ACTIVE.DESC;
      this.voiceButtonTarget.classList.add(ACTIVE_CLASS);
      this.voiceIconTarget.classList.add(VOICE_ACTIVE.ICON_CLASS);
      this.voiceIconTarget.classList.remove(VOICE.ICON_CLASS);
    } else {
      this.voiceButtonTarget.title = VOICE.DESC;
      this.voiceButtonTarget.classList.remove(ACTIVE_CLASS);
      this.voiceIconTarget.classList.add(VOICE.ICON_CLASS);
      this.voiceIconTarget.classList.remove(VOICE_ACTIVE.ICON_CLASS);
    }
  }

  constructor(context: Context) {
    super(context);
    this._isRecording = false;
    this.recognition = null;
  }

  public initialize() {
    // Try to initialize voice recognition
    this.recognition = makeSpeechRecognizer({
      onStart: () => {
        this.isRecording = true;
      },
      onEnd: () => {
        this.isRecording = false;
      },
      onResult: (event: SpeechRecognitionEvent) => {
        this.inputTarget.value = event.results[0]?.[0].transcript;
        this.formTarget.submit();
      },
    });

    // Show voice toggle button if supported
    if (this.recognition) {
      this.isRecording = false;
      this.voiceButtonTarget.classList.add(SUPPORTED_CLASS);
    }
  }

  /**
   * Starts / stops voice recognition
   */
  public toggleVoice() {
    if (!this.recognition) {
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
  }
}
