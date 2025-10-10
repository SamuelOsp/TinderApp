import { Injectable } from '@angular/core';
import { supabase } from 'src/app/database/supabase';

@Injectable({ providedIn: 'root' })
export class Uploader {
  private toBytes(base64: string): Uint8Array {
    const clean = base64.replace(/^data:.*;base64,/, '');
    const bin = atob(clean);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  async upload(bucket: string, name: string, type: string, base64: string) {
    const bytes = this.toBytes(base64);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(name, bytes, {
        contentType: type,
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('[Uploader.upload] error:', error);
      throw error;
    }
    return data?.path || name;
  }

  async getUrl(bucket: string, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600);

    if (error) {
      console.error('[Uploader.getUrl] error:', error);
      throw error;
    }
    return data?.signedUrl || '';
  }


  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
