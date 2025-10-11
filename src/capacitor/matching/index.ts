import { registerPlugin, PluginListenerHandle } from '@capacitor/core';

export interface ProfilePhoto { url: string }
export interface Profile { id: string; name: string; age?: number; distanceKm?: number; photos: ProfilePhoto[]; bio?: string; }

export type MatchingEvents = {
  like: { profileId: string };                     
  nope: { profileId: string };                     
  match: { profileId: string; conversationId?: string };
  profilesUpdated: { profiles: Profile[] };
};

export interface GetProfilesResult { profiles: Profile[] }

export interface MatchingPlugin {
  getProfiles(options: { limit?: number }): Promise<GetProfilesResult>;
  like(options: { profileId: string }): Promise<{ match?: boolean; conversationId?: string }>;
  pass(options: { profileId: string }): Promise<void>;
  addListener<E extends keyof MatchingEvents>(eventName: E, listener: (data: MatchingEvents[E]) => void): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}

export const Matching = registerPlugin<MatchingPlugin>('Matching');
