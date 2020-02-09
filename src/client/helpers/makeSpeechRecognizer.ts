export interface MakeRecognizerArguments {
  onStart: (event: Event) => void;
  onEnd: (event: Event) => void;
  onResult: (event: SpeechRecognitionEvent) => void;
  onError?: (error: SpeechRecognitionError) => void;
}

export function makeSpeechRecognizer({
  onStart,
  onEnd,
  onResult,
  onError = (error: SpeechRecognitionError) => {
    console.error(error);
  },
}: MakeRecognizerArguments): SpeechRecognition | null {
  window.SpeechRecognition =
    // @ts-ignore
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!window.SpeechRecognition) {
    return null;
  }

  const recognizer = new window.SpeechRecognition();
  recognizer.continuous = true;
  recognizer.interimResults = false;
  recognizer.onstart = onStart;
  recognizer.onend = onEnd;
  recognizer.onresult = onResult;
  recognizer.onerror = onError;

  return recognizer;
}
