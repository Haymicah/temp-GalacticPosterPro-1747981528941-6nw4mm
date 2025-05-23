export class VoiceRecognition {
  recognition: SpeechRecognition | null = null;
  isListening: boolean = false;

  constructor(onResult: (text: string) => void, onError: (error: string) => void) {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      
      this.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        onResult(text);
      };
      
      this.recognition.onerror = (event) => {
        onError(event.error);
      };
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}