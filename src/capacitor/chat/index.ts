import { registerPlugin } from '@capacitor/core';

export interface ChatPlugin {
  open(options: {
    meUid: string;
    withUid: string;
    peerName?: string;
    autoMessage?: string;
  }): Promise<{ ok: boolean }>;
}

export const Chat = registerPlugin<ChatPlugin>('Chat');
