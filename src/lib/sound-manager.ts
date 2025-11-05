export class SoundManager {
  private sounds: Map<string, HTMLAudioElement>;
  private volume: number;
  private enabled: boolean;

  constructor() {
    this.sounds = new Map();
    this.volume = 0.5;
    this.enabled = true;
    this.initializeSounds();
  }

  private initializeSounds() {
    // Create audio elements for different events
    // Using data URIs for simple tones since we can't host audio files
    
    // First blood sound - triumphant tone
    const firstBloodSound = this.createTone([659.25, 783.99, 987.77], 0.3, 0.5);
    this.sounds.set('first_blood', firstBloodSound);

    // Top 1 change - fanfare
    const top1Sound = this.createTone([523.25, 659.25, 783.99, 1046.50], 0.3, 0.6);
    this.sounds.set('top1_change', top1Sound);

    // Rank change - notification
    const rankChangeSound = this.createTone([523.25, 659.25], 0.2, 0.3);
    this.sounds.set('rank_change', rankChangeSound);

    // General notification
    const notificationSound = this.createTone([783.99], 0.2, 0.3);
    this.sounds.set('notification', notificationSound);
  }

  private createTone(frequencies: number[], duration: number, volume: number): HTMLAudioElement {
    // Create a simple beep using Web Audio API and convert to audio element
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    frequencies.forEach((freq, index) => {
      const startSample = Math.floor((index / frequencies.length) * data.length);
      const endSample = Math.floor(((index + 1) / frequencies.length) * data.length);
      
      for (let i = startSample; i < endSample; i++) {
        const t = i / audioContext.sampleRate;
        const envelope = Math.sin((Math.PI * (i - startSample)) / (endSample - startSample));
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * volume;
      }
    });

    // Convert buffer to blob and create audio element
    const audio = new Audio();
    const offlineContext = new OfflineAudioContext(1, buffer.length, audioContext.sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineContext.destination);
    source.start(0);

    offlineContext.startRendering().then((renderedBuffer) => {
      const wav = this.audioBufferToWav(renderedBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      audio.src = URL.createObjectURL(blob);
    });

    return audio;
  }

  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const sampleRate = buffer.sampleRate;
    const numChannels = buffer.numberOfChannels;

    // WAV header
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);

    // Write audio data
    const channels = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  play(soundName: string) {
    if (!this.enabled) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.volume = this.volume;
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.warn('Failed to play sound:', error);
      });
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  getVolume(): number {
    return this.volume;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
