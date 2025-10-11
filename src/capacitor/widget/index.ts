import { registerPlugin } from '@capacitor/core';

export interface WidgetUpdaterPlugin {
  update(): Promise<void>;
}

export const WidgetUpdater = registerPlugin<WidgetUpdaterPlugin>('WidgetUpdater');
export default WidgetUpdater;
