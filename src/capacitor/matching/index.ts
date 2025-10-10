import { registerPlugin } from '@capacitor/core';

export type LikePayload = { to: string };
export type OpenChatPayload = { with: string };

export interface MatchingPlugin {

  open(options: { uid: string }): Promise<{ ok: boolean }>;

  addListener(eventName: 'like', listener: (data: LikePayload) => void): Promise<void>;
  addListener(eventName: 'nope', listener: (data: LikePayload) => void): Promise<void>;
  addListener(eventName: 'openChat', listener: (data: OpenChatPayload) => void): Promise<void>;
  removeAllListeners(): Promise<void>;
}

export const Matching = registerPlugin<MatchingPlugin>('Matching');
