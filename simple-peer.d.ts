declare module 'simple-peer' {
  interface SimplePeerOptions {
    initiator?: boolean;
    channelConfig?: object;
    channelName?: string;
    config?: object;
    offerOptions?: object;
    answerOptions?: object;
    sdpTransform?: (sdp: string) => string;
    stream?: MediaStream;
    streams?: MediaStream[];
    trickle?: boolean;
    allowHalfTrickle?: boolean;
    objectMode?: boolean;
    wrtc?: object;
  }

  interface Instance extends NodeJS.EventEmitter {
    signal(data: any): void;
    send(data: any): void;
    addStream(stream: MediaStream): void;
    removeStream(stream: MediaStream): void;
    replaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack, stream: MediaStream): void;
    addTrack(track: MediaStreamTrack, stream: MediaStream): void;
    removeTrack(track: MediaStreamTrack, stream: MediaStream): void;
    destroy(err?: Error): void;
  }

  class SimplePeer {
    constructor(opts?: SimplePeerOptions);

    on(event: 'signal', listener: (data: any) => void): this;
    on(event: 'connect', listener: () => void): this;
    on(event: 'data', listener: (data: any) => void): this;
    on(event: 'stream', listener: (stream: MediaStream) => void): this;
    on(event: 'track', listener: (track: MediaStreamTrack, stream: MediaStream) => void): this;
    on(event: 'close', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    signal(data: any): void;
    send(data: any): void;
    addStream(stream: MediaStream): void;
    removeStream(stream: MediaStream): void;
    replaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack, stream: MediaStream): void;
    addTrack(track: MediaStreamTrack, stream: MediaStream): void;
    removeTrack(track: MediaStreamTrack, stream: MediaStream): void;
    destroy(err?: Error): void;
  }

  export = SimplePeer;
}