import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Firestore, doc, docData, setDoc, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { Auth, authState, User, signOut } from '@angular/fire/auth';

import { File } from 'src/app/core/providers/file/file';
import { Uploader } from 'src/app/core/providers/uploader/uploader';
import { ToastController, LoadingController } from '@ionic/angular';

import { Subscription, filter } from 'rxjs';

type UserDoc = {
  uid: string;
  name?: string;
  bio?: string;
  photos?: string[];
  updatedAt?: any;
};

@Component({
  selector: 'app-update-user-info',
  templateUrl: './update-user-info.page.html',
  styleUrls: ['./update-user-info.page.scss'],
  standalone: false
})
export class UpdateUserInfoPage implements OnInit, OnDestroy {
  private readonly BUCKET = 'imagestinder';

  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);
  private fileSrv = inject(File);
  private uploader = inject(Uploader);
  private toast = inject(ToastController);
  private loading = inject(LoadingController);

  me?: User;
  model: UserDoc = { uid: '', name: '', bio: '', photos: [] };
  busy = false;

  private sub?: Subscription;

  ngOnInit() {
    this.sub = authState(this.auth)
      .pipe(filter((u): u is User => !!u))
      .subscribe((u) => {
        this.me = u;
        const r = doc(this.firestore, `users/${u.uid}`);
        docData(r, { idField: 'uid' }).subscribe((d: any) => {
          this.model = {
            uid: u.uid,
            name: d?.name || u.displayName || '',
            bio: d?.bio || '',
            photos: (d?.photos || []) as string[]
          };
        });
      });
  }
  ngOnDestroy() { this.sub?.unsubscribe(); }

  async saveBasics() {
    if (!this.me) return;
    const r = doc(this.firestore, `users/${this.me.uid}`);
    await setDoc(r, {
      name: (this.model.name || '').trim(),
      bio: (this.model.bio || '').trim(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    (await this.toast.create({ message: 'Guardado', duration: 1200 })).present();
  }

  async addPhoto() {
    if (!this.me) return;

    try {
      const ok = await this.fileSrv.requestPermission();
      if (!ok) return;

      const img = await this.fileSrv.pickImage();
      if (!img?.data) return;

      this.busy = true;
      const path = `users/${this.me.uid}/${Date.now()}-${img.name}`;
      const storedPath = await this.uploader.upload(this.BUCKET, path, img.mimeType, img.data);
      if (!storedPath) throw new Error('No se pudo subir la imagen');

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
      if (!url) throw new Error('No se pudo obtener la URL');

      // Actualiza array (máx 9)
      const photos = [...(this.model.photos || []), url].slice(0, 9);
      this.model.photos = photos;

      await updateDoc(doc(this.firestore, `users/${this.me.uid}`), {
        photos,
        updatedAt: serverTimestamp()
      });
    } catch (e: any) {
      (await this.toast.create({
        message: e?.message ?? 'Error al subir la imagen',
        duration: 2000, color: 'danger'
      })).present();
    } finally { this.busy = false; }
  }

  async removePhoto(i: number) {
    if (!this.me) return;
    const arr = [...(this.model.photos || [])];
    arr.splice(i, 1);
    this.model.photos = arr;
    await updateDoc(doc(this.firestore, `users/${this.me.uid}`), {
      photos: arr,
      updatedAt: serverTimestamp()
    });
  }

  async setPrimary(i: number) {
    if (!this.me) return;
    const arr = [...(this.model.photos || [])];
    if (i <= 0 || i >= arr.length) return;
    const [sel] = arr.splice(i, 1);
    arr.unshift(sel);
    this.model.photos = arr;
    await updateDoc(doc(this.firestore, `users/${this.me.uid}`), {
      photos: arr,
      updatedAt: serverTimestamp()
    });
  }

  async logout() {
    const l = await this.loading.create({ message: 'Cerrando sesión...' });
    await l.present();
    await import('@angular/fire/auth').then(async ({ signOut }) => signOut(this.auth));
    await l.dismiss();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  trackByIndex(_: number, v: string) { return v; }
}
