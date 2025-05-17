declare module 'recordrtc' {
  interface RecordRTCOptions {
    type?: string;
    mimeType?: string;
    recorderType?: any;
    disableLogs?: boolean;
    timeSlice?: number;
    ondataavailable?: (blob: Blob) => void;
    bitsPerSecond?: number;
    audioBitsPerSecond?: number;
    videoBitsPerSecond?: number;
    quality?: number;
    canvas?: {
      width: number;
      height: number;
    };
    frameRate?: number;
    desiredSampRate?: number;
    video?: HTMLVideoElement | any;
    audio?: boolean;
    video?: boolean;
  }

  class RecordRTC {
    constructor(stream: MediaStream, options?: RecordRTCOptions);
    
    startRecording(): void;
    stopRecording(callback?: (url: string) => void): void;
    pauseRecording(): void;
    resumeRecording(): void;
    getBlob(): Blob;
    toURL(): string;
    getDataURL(callback: (dataURL: string) => void): void;
    save(fileName?: string): void;
  }
  
  namespace RecordRTC {
    const MediaStreamRecorder: any;
  }
  
  export = RecordRTC;
}