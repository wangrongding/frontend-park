export interface MediaDeviceInfo {
  deviceId: string
  groupId: string
  kind: string
  label: string
}

export interface MediaStreamTrack {
  enabled: boolean
  id: string
  kind: string
  label: string
  muted: boolean
  readonly: boolean
  readyState: string
  remote: boolean
  applyConstraints(constraints: MediaTrackConstraints): Promise<void>
  clone(): MediaStreamTrack
  getCapabilities(): MediaTrackCapabilities
  getConstraints(): MediaTrackConstraints
  getSettings(): MediaTrackSettings
  stop(): void
}
export interface MediaTrackCapabilities {
  aspectRatio: boolean
  deviceId: boolean
  echoCancellation: boolean
  facingMode: boolean
  frameRate: boolean
  groupId: boolean
  height: boolean
  resizeMode: boolean
  sampleRate: boolean
  sampleSize: boolean
  volume: boolean
  width: boolean
}
export interface MediaTrackConstraints {
  aspectRatio?: number
  deviceId?: string
  echoCancellation?: boolean
  facingMode?: string
  frameRate?: number
  groupId?: string
  height?: number
  resizeMode?: string
  sampleRate?: number
  sampleSize?: number
  volume?: number
  width?: number
}
export interface MediaTrackSettings {
  aspectRatio: number
  deviceId: string
  echoCancellation: boolean
  facingMode: string
  frameRate: number
  groupId: string
  height: number
  resizeMode: string
  sampleRate: number
  sampleSize: number
  volume: number
  width: number
}
export interface MediaStreamEventMap {
  active: Event
  addtrack: MediaStreamTrackEvent
  inactive: Event
  removetrack: MediaStreamTrackEvent
}

// export interface MediaStream {
//   getVideoTracks(): MediaStreamTrack[]
//   getAudioTracks(): MediaStreamTrack[]
// }

export interface MediaStream extends EventTarget {
  active: boolean
  id: string
  onactive: (this: MediaStream, ev: Event) => any
  onaddtrack: (this: MediaStream, ev: MediaStreamTrackEvent) => any
  oninactive: (this: MediaStream, ev: Event) => any
  onremovetrack: (this: MediaStream, ev: MediaStreamTrackEvent) => any
  addTrack(track: MediaStreamTrack): void
  clone(): MediaStream
  getAudioTracks(): MediaStreamTrack[]
  getTrackById(trackId: string): MediaStreamTrack | null
  getTracks(): MediaStreamTrack[]
  getVideoTracks(): MediaStreamTrack[]
  removeTrack(track: MediaStreamTrack): void
  stop(): void
  addEventListener<K extends keyof MediaStreamEventMap>(
    type: K,
    listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => any,
    useCapture?: boolean,
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    useCapture?: boolean,
  ): void
}

export interface MediaStreamError {
  constraintName: string
  message: string
  name: string
}

export interface MediaStreamErrorEvent extends Event {
  error: MediaStreamError
}

export interface MediaStreamTrackEventMap {
  ended: MediaStreamErrorEvent
  muted: Event
  unmuted: Event
}

interface MediaTrackConstrains {
  advanced?: MediaTrackConstraintSet[]
  audio?: boolean | MediaTrackConstraints
  video?: boolean | MediaTrackConstraints
}
