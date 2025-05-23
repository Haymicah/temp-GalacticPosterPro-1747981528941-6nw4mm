import RecordRTC from 'recordrtc';
import WaveSurfer from 'wavesurfer.js';

export class AudioManager {
  private recorder: RecordRTC | null = null;
  private stream: MediaStream | null = null;
  private wavesurfer: WaveSurfer | null = null;

  async initializeRecorder() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new RecordRTC(this.stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 2,
        desiredSampRate: 44100
      });
    } catch (error) {
      console.error('Error initializing audio recorder:', error);
      throw error;
    }
  }

  startRecording() {
    if (!this.recorder) {
      throw new Error('Recorder not initialized');
    }
    this.recorder.startRecording();
  }

  async stopRecording(): Promise<Blob> {
    if (!this.recorder) {
      throw new Error('Recorder not initialized');
    }
    
    return new Promise((resolve) => {
      this.recorder!.stopRecording(() => {
        const blob = this.recorder!.getBlob();
        resolve(blob);
      });
    });
  }

  initializeWaveform(container: HTMLElement) {
    this.wavesurfer = WaveSurfer.create({
      container,
      waveColor: '#00FF00',
      progressColor: '#004400',
      cursorColor: '#FFFFFF',
      barWidth: 2,
      barGap: 1,
      responsive: true,
      height: 60,
      normalize: true
    });
  }

  async loadAudio(file: File | Blob) {
    if (!this.wavesurfer) {
      throw new Error('Waveform not initialized');
    }
    
    const url = URL.createObjectURL(file);
    await this.wavesurfer.load(url);
    URL.revokeObjectURL(url);
  }

  play() {
    this.wavesurfer?.play();
  }

  pause() {
    this.wavesurfer?.pause();
  }

  destroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.recorder) {
      this.recorder.destroy();
      this.recorder = null;
    }
    
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
      this.wavesurfer = null;
    }
  }
}