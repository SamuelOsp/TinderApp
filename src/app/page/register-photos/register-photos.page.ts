import { Component, inject } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';

import { File } from 'src/app/core/providers/file/file';
import { Uploader } from 'src/app/core/providers/uploader/uploader';
import { NativeToast } from 'src/app/core/providers/nativeToast/native-toast';
import { SignUpStateService } from 'src/app/core/services/sign-up-state/sign-up-state-service';
import { User } from 'src/app/shared/services/user';

import { getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';

type PhotoItem = { src: string; uploading: boolean; path?: string };

@Component({
  selector: 'app-register-photos',
  templateUrl: './register-photos.page.html',
  styleUrls: ['./register-photos.page.scss'],
  standalone: false,
})
export class RegisterPhotosPage {
  photos: PhotoItem[] = [];

  private state = inject(SignUpStateService);
  private userSrv = inject(User);
  private nav = inject(NavController);
  private loading = inject(LoadingController);
  private toast = inject(NativeToast);
  private ionicToast = inject(ToastController);
  private fileSrv = inject(File);
  private uploader = inject(Uploader);

  private readonly BUCKET = 'imagestinder';

  async pick() {
    try {
      const ok = await this.fileSrv.requestPermission();
      if (!ok) return;

      const img = await this.fileSrv.pickImage();
      if (!img?.data) return;

      const dataUrl = `data:${img.mimeType};base64,${img.data}`;
      const item: PhotoItem = { src: dataUrl, uploading: true };
      this.photos.unshift(item);
      const idx = 0;

      const path = `profile/${Date.now()}-${img.name}`;
      const storedPath = await this.uploader.upload(this.BUCKET, path, img.mimeType, img.data);
      if (!storedPath) {
        this.photos.splice(idx, 1);
        (await this.ionicToast.create({ message: 'Error subiendo la imagen', duration: 2000, color: 'danger' })).present();
        return;
      }

      let url = '';
      try {
        if ((this.uploader as any).getPublicUrl) {
          url = (this.uploader as any).getPublicUrl(this.BUCKET, storedPath);
        } else {
          url = await this.uploader.getUrl(this.BUCKET, storedPath);
        }
      } catch {
        url = await this.uploader.getUrl(this.BUCKET, storedPath);
      }

      if (!url) {
        this.photos.splice(idx, 1);
        (await this.ionicToast.create({ message: 'No se pudo obtener la URL de la imagen', duration: 2000, color: 'danger' })).present();
        return;
      }

      this.photos[idx] = { src: url, uploading: false, path: storedPath };
      this.state.addPhoto(url);

    } catch (err: any) {
      console.error('[register-photos.pick] error:', err);
      const failing = this.photos.find(p => p.uploading);
      if (failing) failing.uploading = false;

      (await this.ionicToast.create({
        message: `Error: ${err?.message ?? 'al subir la imagen'}`,
        duration: 2200,
        color: 'danger',
      })).present();
    }
  }

  remove(i: number) {
    this.photos.splice(i, 1);

  }

  async finish() {
  const p = this.state.payload();

  const examPayload = {
    name: p.name,
    lastName: p.lastName,
    birthDate: p.birthDate,
    email: p.email,           
    password: p.password,      
    country: p.country,
    city: p.city,
    gender: p.gender,
    showGenderProfile: !!p.showGenderProfile,
    passions: p.passions,
    photos: p.photos.length ? p.photos : ['/profile/name.jpg', '/profile/name.jpg'],
  };

  const email = (examPayload.email ?? '').trim();
  const password = (examPayload.password ?? '').trim();
  if (!email || !password) {
    (await this.ionicToast.create({
      message: 'Email y password son obligatorios',
      duration: 1800,
      color: 'warning',
    })).present();
    return;
  }

  const l = await this.loading.create({ message: 'Creating account...' });
  await l.present();

  try {
    const auth = getAuth();
    if (!auth.currentUser) {
      await createUserWithEmailAndPassword(auth, email, password);
    }

    await this.userSrv.create({
      ...examPayload,
      email,        
      password,
    } as any);

    await l.dismiss();
    this.toast.show('register.messages.success', 'success', 'bottom');
    this.nav.navigateRoot('/login');
  } catch (e: any) {
    await l.dismiss();
    console.error('[register-photos.finish] error:', e);
    (await this.ionicToast.create({
      message: `Error creating account: ${e?.message ?? ''}`,
      duration: 2200,
      color: 'danger',
    })).present();
  }
}}
