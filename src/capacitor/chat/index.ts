import { registerPlugin } from '@capacitor/core';

export interface OpenOptions {
  meUid: string;
  withUid: string;
  peerName?: string;
  autoMessage?: string;
  peerPhotoUrl?: string;
  
  [key: string]: any;
}

export interface ChatPlugin {
  open(options: OpenOptions): Promise<{ ok: boolean }>;
}

export const Chat = registerPlugin<ChatPlugin>('Chat');
export default Chat;
