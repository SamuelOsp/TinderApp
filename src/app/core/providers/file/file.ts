// src/app/core/providers/file/file.ts
import { Injectable } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Capacitor } from '@capacitor/core';
import { NativeToast } from '../nativeToast/native-toast';
import { IImage } from 'src/interface/image.interface';

@Injectable({ providedIn: 'root' })
export class File {
  constructor(private readonly toast: NativeToast) {}

  async requestPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return true;

    try {
      const res: any = await FilePicker.requestPermissions();
      const granted = Object.values(res || {}).some(
        v => v === 'granted' || v === 'limited'
      );
      if (!granted) {
        await this.toast.show('Permission denied, enable it in Settings');
        return false;
      }
      return true;
    } catch {
      return true;
    }
  }

  async pickImage(): Promise<IImage> {
    const result = await FilePicker.pickImages({
      limit: 1,
      readData: true,
    });

    if (!result.files?.length) {
      await this.toast.show('No image selected');
      throw new Error('no_image');
    }

    const f = result.files[0];

    const cleanBase64 = (f.data || '').replace(/^data:.*;base64,/, '');

    return {
      data: cleanBase64,
      mimeType: f.mimeType || 'image/jpeg',
      name: f.name || `photo_${Date.now()}.jpg`,
    };
  }
}
