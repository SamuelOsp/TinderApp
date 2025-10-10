import { registerPlugin } from '@capacitor/core';

export interface ChatPlugin {

  open(options: { me: string; with: string }): Promise<{ ok: boolean }>;
}

export const Chat = registerPlugin<ChatPlugin>('Chat');
